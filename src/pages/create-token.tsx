import { useMemo, useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { z } from 'zod';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ConnectWalletButton } from '../components/ConnectWalletButton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/Dialog';
import { useForm } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { Keypair, Transaction, Connection } from '@solana/web3.js';
import { useWallet } from '@jup-ag/wallet-adapter';
import { toast } from 'sonner';

// Define the schema for form validation
const founderSchema = z.object({
  name: z.string().min(1, 'Founder name is required'),
  twitter: z
    .string()
    .regex(/^@[^\s]+$/, 'X Profile must start with "@" and cannot contain spaces')
    .min(1, 'X Profile is required'),
});

const tokenSchema = z.object({
  tokenName: z.string().min(3, 'Token name must be at least 3 characters'),
  tokenSymbol: z
    .string()
    .min(1, 'Token symbol is required')
    .max(10, 'Token symbol must not exceed 10 characters')
    .regex(/^[A-Z0-9]+$/, 'Token symbol must contain only uppercase letters and numbers'),
  tokenLogo: z.instanceof(File, { message: 'Token logo is required' }),
  website: z
    .string()
    .url({ message: 'Please enter a valid URL' })
    .min(1, 'Website URL is required'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description cannot exceed 500 characters'),
  twitter: z
    .string()
    .regex(/^@[^\s]+$/, 'X Profile must start with "@" and cannot contain spaces')
    .min(1, 'X Profile is required'),
  telegram: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
  linkedin: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
  founders: z
    .array(founderSchema)
    .min(1, 'At least one founder is required')
    .max(4, 'Maximum of 4 founders allowed'),
});

interface FounderInfo {
  name: string;
  twitter: string;
}

interface FormValues {
  tokenName: string;
  tokenSymbol: string;
  tokenLogo: File | undefined;
  description: string;
  website: string;
  twitter: string;
  telegram?: string;
  linkedin?: string;
  founders: FounderInfo[];
}

export default function CreateToken() {
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const address = useMemo(() => publicKey?.toBase58(), [publicKey]);

  const [isLoading, setIsLoading] = useState(false);
  const [tokenCreated, setTokenCreated] = useState(false);
  const [tokenMint, setTokenMint] = useState<string>('');
  const [createdTokenSymbol, setCreatedTokenSymbol] = useState<string>('');

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [founders, setFounders] = useState<FounderInfo[]>([{ name: '', twitter: '' }]);

  // Create a ref to the form element for scrolling after errors
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm({
    defaultValues: {
      tokenName: '',
      tokenSymbol: '',
      tokenLogo: undefined,
      description: '',
      website: '',
      twitter: '',
      telegram: '',
      linkedin: '',
      founders: [{ name: '', twitter: '' }],
    } as FormValues,
    onSubmit: async ({ value }) => {
      try {
        setIsLoading(true);

        // Validate token logo
        const { tokenLogo } = value;
        if (!tokenLogo) {
          toast.error('Token logo is required');
          return;
        }

        // Check if wallet is connected
        if (!signTransaction || !sendTransaction) {
          toast.error('Wallet is not connected properly');
          return;
        }

        const keyPair = Keypair.generate();
        const mint = keyPair.publicKey.toBase58();

        // Step 1: Create FormData for efficient file upload
        const formData = new FormData();
        formData.append('tokenLogo', tokenLogo);
        formData.append('mint', mint);
        formData.append('tokenName', value.tokenName);
        formData.append('tokenSymbol', value.tokenSymbol);
        formData.append('description', value.description);
        formData.append('website', value.website);
        formData.append('twitter', value.twitter);
        formData.append('telegram', value.telegram || '');
        formData.append('linkedin', value.linkedin || '');
        formData.append('founders', JSON.stringify(value.founders));
        formData.append('userWallet', address!);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData, // No Content-Type header needed for FormData
        });
        if (!uploadResponse.ok) {
          const error = await uploadResponse.json();
          throw new Error(error.error);
        }

        const uploadResult = await uploadResponse.json();
        const { poolTx, lastValidBlockHeight, recentBlockhash } = uploadResult;
        const transaction = Transaction.from(Buffer.from(poolTx, 'base64'));

        // Step 2: Sign with keypair first
        transaction.sign(keyPair);

        // Step 3: Use Phantom's preferred method - sendTransaction handles both signing and sending
        const connection = new Connection(
          process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com',
          'confirmed'
        );

        try {
          // This is the Phantom-friendly approach - no manual transaction sending needed
          const signature = await sendTransaction(transaction, connection, {
            skipPreflight: false,
            maxRetries: 3,
          });

          // Wait for confirmation
          const confirmation = await connection.confirmTransaction(
            {
              signature,
              blockhash: recentBlockhash,
              lastValidBlockHeight,
            },
            'confirmed'
          );
          if (confirmation.value.err) {
            console.error({ confirmation });
            throw new Error('Transaction failed to confirm');
          }

          // Trigger triggerOnchainSuccess API
          await fetch(`/api/trigger-onchain-success?mint=${mint}`, { method: 'POST' });

          toast.success('Token created successfully');

          // Store the mint address and token symbol for use in the success page
          setTokenMint(mint);
          setCreatedTokenSymbol(value.tokenSymbol);
          setTokenCreated(true);
        } catch (txError) {
          console.error('Transaction error:', txError);
          throw new Error(txError instanceof Error ? txError.message : 'Transaction failed');
        }
      } catch (error) {
        console.error('Error creating token:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to create token');
      } finally {
        setIsLoading(false);
      }
    },
    validators: {
      onSubmit: tokenSchema,
    },
  });

  return (
    <>
      <Head>
        <title>Create Token - Virtual Curve</title>
        <meta
          name="description"
          content="Create a new token on Sanafi Launchpad with customizable settings."
        />
      </Head>

      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="container mx-auto px-4 py-10 flex-1">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h1 className="text-4xl font-bold mb-2">Create Token</h1>
              <p className="text-gray-300">Launch your token with a customizable details</p>
            </div>
          </div>

          {tokenCreated && !isLoading ? (
            <TokenCreationSuccess tokenMint={tokenMint} tokenSymbol={createdTokenSymbol} />
          ) : (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8" ref={formRef}>
              {/* Loading Overlay */}
              {isLoading && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
                  <div className="bg-white/10 p-8 rounded-xl border border-white/20 flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-t-primary border-white/30 rounded-full animate-spin mb-4"></div>
                    <p className="text-white text-lg font-medium">Creating your token...</p>
                    <p className="text-white/70 text-sm mt-2">Please don&apos;t close this page</p>
                  </div>
                </div>
              )}

              {/* Token Details Section */}
              <div className="bg-white/5 rounded-xl p-8 backdrop-blur-sm border border-white/10">
                <h2 className="text-2xl font-bold mb-4">Token Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <label
                        htmlFor="tokenName"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Token Name*
                      </label>
                      {form.Field({
                        name: 'tokenName',
                        children: (field) => (
                          <input
                            id="tokenName"
                            name={field.name}
                            type="text"
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                            placeholder="e.g. Sanafi Token"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            required
                            minLength={3}
                            disabled={isLoading}
                          />
                        ),
                      })}
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="tokenSymbol"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Token Symbol*
                      </label>
                      {form.Field({
                        name: 'tokenSymbol',
                        children: (field) => (
                          <input
                            id="tokenSymbol"
                            name={field.name}
                            type="text"
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                            placeholder="e.g. SANA"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            required
                            maxLength={10}
                            disabled={isLoading}
                          />
                        ),
                      })}
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Description*
                      </label>
                      {form.Field({
                        name: 'description',
                        children: (field) => (
                          <div className="relative">
                            <textarea
                              id="description"
                              name={field.name}
                              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white min-h-[120px]"
                              placeholder="Tell the story of your project. What problem does it solve? What's your mission?"
                              value={field.state.value}
                              onChange={(e) => {
                                if (e.target.value.length <= 500) {
                                  field.handleChange(e.target.value);
                                }
                              }}
                              required
                              maxLength={500}
                              disabled={isLoading}
                            />
                            <div className="text-right text-xs text-gray-400 mt-1">
                              {field.state.value?.length || 0}/500 characters
                            </div>
                          </div>
                        ),
                      })}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="tokenLogo"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Token Logo*
                    </label>
                    {form.Field({
                      name: 'tokenLogo',
                      children: (field) => (
                        <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                          {logoPreview ? (
                            <div className="flex flex-col items-center justify-center">
                              <img
                                src={logoPreview}
                                alt="Token logo preview"
                                className="w-24 h-24 object-contain mb-3"
                              />
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    field.handleChange(undefined);
                                    setLogoPreview(null);
                                  }}
                                  className="bg-red-500/30 text-red-200 px-3 py-1 rounded text-xs hover:bg-red-500/50 transition"
                                >
                                  Remove
                                </button>
                                <label
                                  htmlFor="tokenLogo"
                                  className="bg-white/10 px-3 py-1 rounded text-xs hover:bg-white/20 transition cursor-pointer"
                                >
                                  Change
                                </label>
                              </div>
                            </div>
                          ) : (
                            <>
                              <span className="iconify w-6 h-6 mx-auto mb-2 text-gray-400 ph--upload-bold" />
                              <p className="text-gray-400 text-xs mb-2">
                                PNG, JPG or SVG (max. 2MB)
                              </p>
                              <label
                                htmlFor="tokenLogo"
                                className="bg-white/10 px-4 py-2 rounded-lg text-sm hover:bg-white/20 transition cursor-pointer"
                              >
                                Browse Files
                              </label>
                            </>
                          )}
                          <input
                            type="file"
                            id="tokenLogo"
                            accept=".png,.jpg,.jpeg,.svg"
                            className="hidden"
                            onChange={(e) => {
                              if (isLoading) return;

                              const file = e.target.files?.[0];
                              if (file) {
                                // Check file size (2MB = 2 * 1024 * 1024 bytes)
                                if (file.size > 2 * 1024 * 1024) {
                                  toast.error('File size exceeds 2MB limit');
                                  return;
                                }

                                // Check file type
                                const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];
                                if (!validTypes.includes(file.type)) {
                                  toast.error('Only PNG, JPG, or SVG files are allowed');
                                  return;
                                }

                                // Create preview
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setLogoPreview(reader.result as string);
                                };
                                reader.readAsDataURL(file);

                                field.handleChange(file);
                              }
                            }}
                            disabled={isLoading}
                          />
                        </div>
                      ),
                    })}
                  </div>
                </div>
              </div>

              {/* Founders Section */}
              <div className="bg-white/5 rounded-xl p-8 backdrop-blur-sm border border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Founder Information</h2>
                  {founders.length < 4 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (isLoading) return;
                        if (founders.length < 4) {
                          const updatedFounders = [...founders, { name: '', twitter: '' }];
                          setFounders(updatedFounders);
                          form.setFieldValue('founders', updatedFounders);
                        }
                      }}
                      disabled={isLoading}
                      className="bg-white/10 px-3 py-1 rounded-lg text-sm hover:bg-white/20 transition flex items-center gap-1"
                    >
                      <span className="iconify ph--plus-bold w-4 h-4" />
                      <span>Add Founder</span>
                    </button>
                  )}
                </div>

                {form.Field({
                  name: 'founders',
                  children: () => (
                    <div className="space-y-6">
                      {founders.map((founder, index) => (
                        <div
                          key={index}
                          className="bg-white/5 rounded-lg p-4 border border-white/10"
                        >
                          <div className="flex justify-between mb-3">
                            <h3 className="font-medium">Founder {index + 1}</h3>
                            {founders.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (isLoading) return;
                                  const updatedFounders = founders.filter((_, i) => i !== index);
                                  setFounders(updatedFounders);
                                  form.setFieldValue('founders', updatedFounders);
                                }}
                                disabled={isLoading}
                                className="text-red-400 hover:text-red-300 transition text-sm flex items-center gap-1"
                              >
                                <span className="iconify ph--trash-bold w-4 h-4" />
                                <span>Remove</span>
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">
                                Name*
                              </label>
                              <input
                                type="text"
                                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                                placeholder="Founder's name"
                                value={founder.name}
                                onChange={(e) => {
                                  const updatedFounders = [...founders];
                                  updatedFounders[index].name = e.target.value;
                                  setFounders(updatedFounders);
                                  form.setFieldValue('founders', updatedFounders);
                                }}
                                required
                                disabled={isLoading}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">
                                X Profile*
                              </label>
                              <input
                                type="text"
                                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                                placeholder="e.g. @username"
                                value={founder.twitter}
                                onChange={(e) => {
                                  const updatedFounders = [...founders];
                                  updatedFounders[index].twitter = e.target.value;
                                  setFounders(updatedFounders);
                                  form.setFieldValue('founders', updatedFounders);
                                }}
                                required
                                disabled={isLoading}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ),
                })}
              </div>

              {/* Social Links Section */}
              <div className="bg-white/5 rounded-xl p-8 backdrop-blur-sm border border-white/10">
                <h2 className="text-2xl font-bold mb-6">Social Links</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="mb-4">
                    <label
                      htmlFor="website"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Website*
                    </label>
                    {form.Field({
                      name: 'website',
                      children: (field) => (
                        <input
                          id="website"
                          name={field.name}
                          type="url"
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                          placeholder="https://yourwebsite.com"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      ),
                    })}
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="twitter"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      X Profile*
                    </label>
                    {form.Field({
                      name: 'twitter',
                      children: (field) => (
                        <input
                          id="twitter"
                          name={field.name}
                          type="text"
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                          placeholder="e.g. @username"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      ),
                    })}
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="telegram"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Telegram
                    </label>
                    {form.Field({
                      name: 'telegram',
                      children: (field) => (
                        <input
                          id="telegram"
                          name={field.name}
                          type="url"
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                          placeholder="https://t.me/yourusername"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={isLoading}
                        />
                      ),
                    })}
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="linkedin"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      LinkedIn
                    </label>
                    {form.Field({
                      name: 'linkedin',
                      children: (field) => (
                        <input
                          id="linkedin"
                          name={field.name}
                          type="url"
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                          placeholder="https://linkedin.com/in/yourusername"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={isLoading}
                        />
                      ),
                    })}
                  </div>
                </div>
              </div>

              {form.state.errors && form.state.errors.length > 0 && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 space-y-2">
                  {form.state.errors.map((error, index) =>
                    Object.entries(error || {}).map(([key, value]) => (
                      <div key={`${index}-${key}`} className="flex items-start gap-2">
                        <p className="text-red-200">
                          {Array.isArray(value) ? value.map((v) => v.message).join(', ') : ''}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}

              <div className="flex justify-end">
                <SubmitButton
                  isSubmitting={isLoading}
                  form={form}
                  resetFounders={() => setFounders([{ name: '', twitter: '' }])}
                  resetLogoPreview={() => setLogoPreview(null)}
                  address={address}
                  setTokenCreated={setTokenCreated}
                  setTokenMint={setTokenMint}
                  setCreatedTokenSymbol={setCreatedTokenSymbol}
                />
              </div>
            </form>
          )}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

const SubmitButton = ({
  isSubmitting,
  form,
  resetFounders,
  resetLogoPreview,
  address,
  setTokenCreated,
  setTokenMint,
  setCreatedTokenSymbol,
}: {
  isSubmitting: boolean;
  form: any;
  resetFounders: () => void;
  resetLogoPreview: () => void;
  address: string | undefined;
  setTokenCreated: (value: boolean) => void;
  setTokenMint: (value: string) => void;
  setCreatedTokenSymbol: (value: string) => void;
}) => {
  const { publicKey } = useWallet();
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  if (!publicKey) {
    return <ConnectWalletButton />;
  }

  const handleSubmit = () => {
    // Validate form using tokenSchema before showing preview modal
    const result = tokenSchema.safeParse(form.state.values);
    if (!result.success) {
      // If validation fails, show toast error and return
      form.validate(); // Trigger form validation to show validation UI

      // Extract error messages from validation result and show in toast
      const errors = result.error.errors;
      const firstError = errors[0]?.message || 'Please check the form for errors';
      toast.error(firstError);
      return;
    }
    // If validation passes, show preview modal
    setShowPreviewModal(true);
  };

  const handleConfirmSubmit = async () => {
    // Call the form's submit handler and handle loading state
    setIsSubmittingForm(true);

    try {
      // Validate balance - check if user has sufficient balance
      const validationResponse = await fetch('/api/create-token-validation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
        }),
      });
      const validationResult = await validationResponse.json();
      if (!validationResult.success) {
        toast.error(validationResult.message || 'Validation failed', { duration: 5000 });
        setIsSubmittingForm(false);
        return;
      }

      // If validation passes, proceed with form submission
      form
        .handleSubmit()
        .catch((error) => {
          console.error('Form submission error:', error);
          toast.error('Failed to create token');
        })
        .finally(() => {
          setShowPreviewModal(false);
          setIsSubmittingForm(false);
        });
    } catch (error) {
      console.error('Validation request error:', error);
      toast.error('Failed to validate token creation requirements');
      setIsSubmittingForm(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <Button
          className="!rounded-lg bg-muted hover:bg-muted/80 hover:scale-105 active:scale-95 transition-all !px-6 !py-1.5 text-xs h-auto text-white flex items-center gap-1"
          type="button"
          onClick={() => {
            form.reset();
            resetFounders();
            resetLogoPreview();
          }}
        >
          <span className="iconify ph--arrow-counter-clockwise-bold w-4 h-4" />
          <span>Reset</span>
        </Button>

        {/* This button is for testing TokenCreationSuccess only */}
        {/* <Button
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          type="button"
          onClick={() => {
            // Set dummy data for testing
            form.setFieldValue('tokenName', 'Test Token');
            form.setFieldValue('tokenSymbol', 'TEST');
            // Trigger success modal
            setTimeout(() => {
              setTokenCreated(true);
              setTokenMint('5dpN5wMH8j8au29Rp91qn4WfNq6t6xJfcjQNcFeDJ8Ct');
              setCreatedTokenSymbol('TEST');
            }, 100);
          }}
        >
          <span className="iconify ph--test-tube-bold w-5 h-5" />
          <span>Test Success</span>
        </Button> */}

        <Button
          className="!rounded-lg !px-6 !py-1.5 text-xs h-auto flex items-center gap-1 hover:scale-105 active:scale-95 transition-transform"
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="iconify ph--spinner w-4 h-4 animate-spin" />
              <span>Creating Token...</span>
            </>
          ) : (
            <>
              <span className="iconify ph--rocket-bold w-4 h-4" />
              <span>Create Token</span>
            </>
          )}
        </Button>
      </div>

      {/* Token Preview Modal */}
      <Dialog
        open={showPreviewModal}
        onOpenChange={isSubmittingForm ? undefined : setShowPreviewModal}
      >
        <DialogContent className="bg-background text-foreground sm:max-w-[1400px] max-h-[95vh] p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold text-center">
              Create Token Preview
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 overflow-y-auto max-h-[75vh]">
            {/* Left Side - Token Details & Founder Information */}
            <div className="pr-2">
              <div className="space-y-4">
                {/* Token Details Section */}
                <div className="border border-white/10 rounded-lg p-4 bg-white/5">
                  <h3 className="text-lg font-bold mb-3 text-center">Token Details</h3>

                  {/* Logo Section */}
                  {(() => {
                    const logoPreview =
                      form.state.values.tokenLogo instanceof File
                        ? URL.createObjectURL(form.state.values.tokenLogo)
                        : null;
                    return (
                      logoPreview && (
                        <div className="flex justify-center mb-4">
                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-2 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
                              <img
                                src={logoPreview}
                                alt="Token Logo"
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <p className="text-xs text-neutral-400">Token Logo</p>
                          </div>
                        </div>
                      )
                    );
                  })()}

                  {/* Token Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-xs text-neutral-400 mb-1">Token Name</p>
                      <p className="font-semibold text-sm">
                        {form.state.values.tokenName || 'Not specified'}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-xs text-neutral-400 mb-1">Symbol</p>
                      <p className="font-semibold text-sm">
                        {form.state.values.tokenSymbol || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="mt-4 bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-neutral-400 mb-2">Description</p>
                    <p className="font-medium text-sm leading-relaxed">
                      {form.state.values.description || 'Not specified'}
                    </p>
                  </div>
                </div>

                {/* Founder Information Section */}
                <div className="border border-white/10 rounded-lg p-4 bg-white/5">
                  <h3 className="text-lg font-bold mb-3 text-center">Founder Information</h3>
                  <div className="space-y-3">
                    {form.state.values.founders?.map((founder: any, index: number) => (
                      <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <p className="text-sm font-semibold mb-2 text-center">
                          Founder {index + 1}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="bg-white/5 rounded-lg p-2">
                            <p className="text-xs text-neutral-400 mb-1">Name</p>
                            <p className="font-medium text-sm">{founder.name || 'Not specified'}</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-2">
                            <p className="text-xs text-neutral-400 mb-1">X Profile</p>
                            <p className="font-medium text-sm">
                              {founder.twitter || 'Not specified'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Social Links & Terms & Conditions */}
            <div className="flex flex-col space-y-4">
              {/* Social Links Section */}
              <div className="border border-white/10 rounded-lg p-4 bg-white/5">
                <h3 className="text-lg font-bold mb-3 text-center">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-neutral-400 mb-1">Website</p>
                    <p className="font-medium text-sm truncate">
                      {form.state.values.website || 'Not specified'}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-neutral-400 mb-1">X Profile</p>
                    <p className="font-medium text-sm truncate">
                      {form.state.values.twitter || 'Not specified'}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-neutral-400 mb-1">Telegram</p>
                    <p className="font-medium text-sm truncate">
                      {form.state.values.telegram || 'Not specified'}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-neutral-400 mb-1">LinkedIn</p>
                    <p className="font-medium text-sm truncate">
                      {form.state.values.linkedin || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions Section */}
              <div className="border border-white/10 rounded-lg p-4 bg-yellow-500/10 flex-1">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <span className="iconify ph--warning-bold w-4 h-4 text-yellow-500" />
                  Terms & Conditions
                </h3>
                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-3">
                    <span className="iconify ph--check-circle-bold w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-300">
                      Must hold at least{' '}
                      <span className="font-semibold text-white">
                        {new Intl.NumberFormat().format(
                          parseInt(process.env.NEXT_PUBLIC_MINIMUM_SANA_REQUIRED || '1000000', 10)
                        )}{' '}
                        SANA
                      </span>{' '}
                      tokens to create a new token on this platform
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="iconify ph--check-circle-bold w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-300">
                      All token information must be accurate and comply with platform guidelines
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="iconify ph--check-circle-bold w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-300">
                      Token creation fees are non-refundable once the transaction is confirmed
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="iconify ph--check-circle-bold w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-300">
                      By proceeding, you agree to our{' '}
                      <Link
                        href="https://ethics.ltd/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 underline"
                      >
                        Terms of Use
                      </Link>{' '}
                      and{' '}
                      <Link
                        href="https://ethics.ltd/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 underline"
                      >
                        Privacy Policy
                      </Link>
                    </p>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-3 mt-auto">
                  <p className="text-xs text-gray-400">
                    By clicking "Reviewed, Launch Now!" you acknowledge that you have read and agree
                    to all terms and conditions above.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex gap-2 justify-center pt-4 mt-4">
            <Button
              onClick={() => setShowPreviewModal(false)}
              className="!rounded-lg bg-muted hover:bg-muted/80 hover:scale-105 active:scale-95 transition-all !px-6 !py-1.5 text-xs h-auto text-white flex items-center gap-1 disabled:hover:scale-100 disabled:hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmittingForm}
            >
              <span className="iconify ph--x-bold w-4 h-4" />
              <span>Cancel</span>
            </Button>
            <Button
              onClick={handleConfirmSubmit}
              className="!rounded-lg !px-6 !py-1.5 text-xs h-auto flex items-center gap-1 hover:scale-105 active:scale-95 transition-transform disabled:hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmittingForm}
            >
              {isSubmittingForm ? (
                <>
                  <span className="iconify ph--spinner w-4 h-4 animate-spin" />
                  <span>Creating Token...</span>
                </>
              ) : (
                <>
                  <span className="iconify ph--rocket-bold w-4 h-4" />
                  <span>Reviewed, Launch Now!</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const TokenCreationSuccess = ({
  tokenMint,
  tokenSymbol,
}: {
  tokenMint: string;
  tokenSymbol: string;
}) => {
  return (
    <>
      <div className="bg-white/5 rounded-xl p-8 backdrop-blur-sm border border-white/10 text-center">
        <div className="bg-green-500/20 p-4 rounded-full inline-flex mb-6">
          <span className="iconify ph--check-bold w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Token Created Successfully!</h2>
        <p className="text-gray-300 mb-6 mx-auto">
          Your token has been created and is now live on the Ethics - Ethical Launchpad. Users can
          now buy and trade your tokens.
        </p>

        {/* Contract Address Section */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-8 max-w-lg mx-auto">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">${tokenSymbol} Contract Address</p>
            <div className="flex items-center justify-between bg-white/10 rounded-lg p-3 border border-white/20">
              <span className="text-sm font-mono text-white truncate mr-2 text-center flex-1">
                {tokenMint}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(tokenMint);
                  toast.success('Contract address copied to clipboard!');
                }}
                className="flex-shrink-0 p-1.5 hover:bg-white/20 rounded transition-colors"
                title="Copy to clipboard"
              >
                <span className="iconify ph--copy-bold w-4 h-4 text-gray-300" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* <Link
            href="/"
            className="bg-white/10 px-6 py-3 rounded-xl font-medium hover:bg-white/20 hover:scale-105 active:scale-95 transition-all"
          >
            Explore Tokens
          </Link> */}
          <Link
            href={`https://jup.ag/tokens/${tokenMint}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 px-6 py-3 rounded-xl font-medium hover:bg-white/20 hover:scale-105 active:scale-95 transition-all"
          >
            View your ${tokenSymbol} on Jupiter
          </Link>
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="cursor-pointer bg-primary px-6 py-3 rounded-xl font-medium hover:opacity-90 hover:scale-105 active:scale-95 transition-all text-black"
          >
            Create Another Token
          </button>
        </div>
      </div>
    </>
  );
};

const TokenPreview = ({ form }: { form: any }) => {
  const formValues = form.state.values;
  const logoPreview =
    form.state.values.tokenLogo instanceof File
      ? URL.createObjectURL(form.state.values.tokenLogo)
      : null;

  return (
    <div className="space-y-4">
      <div className="border border-white/10 rounded-lg p-4 bg-white/5">
        <h3 className="text-lg font-bold mb-3 text-center">Token Details</h3>

        {/* Logo Section */}
        {logoPreview && (
          <div className="flex justify-center mb-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
                <img src={logoPreview} alt="Token Logo" className="w-full h-full object-contain" />
              </div>
              <p className="text-xs text-neutral-400">Token Logo</p>
            </div>
          </div>
        )}

        {/* Token Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-neutral-400 mb-1">Token Name</p>
            <p className="font-semibold text-sm">{formValues.tokenName || 'Not specified'}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-neutral-400 mb-1">Symbol</p>
            <p className="font-semibold text-sm">{formValues.tokenSymbol || 'Not specified'}</p>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-4 bg-white/5 rounded-lg p-3">
          <p className="text-xs text-neutral-400 mb-2">Description</p>
          <p className="font-medium text-sm leading-relaxed">
            {formValues.description || 'Not specified'}
          </p>
        </div>
      </div>

      <div className="border border-white/10 rounded-lg p-4 bg-white/5">
        <h3 className="text-lg font-bold mb-3 text-center">Founder Information</h3>
        <div className="space-y-3">
          {formValues.founders?.map((founder: any, index: number) => (
            <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
              <p className="text-sm font-semibold mb-2 text-center">Founder {index + 1}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-lg p-2">
                  <p className="text-xs text-neutral-400 mb-1">Name</p>
                  <p className="font-medium text-sm">{founder.name || 'Not specified'}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2">
                  <p className="text-xs text-neutral-400 mb-1">X Profile</p>
                  <p className="font-medium text-sm">{founder.twitter || 'Not specified'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-white/10 rounded-lg p-4 bg-white/5">
        <h3 className="text-lg font-bold mb-3 text-center">Social Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-neutral-400 mb-1">Website</p>
            <p className="font-medium text-sm truncate">{formValues.website || 'Not specified'}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-neutral-400 mb-1">X Profile</p>
            <p className="font-medium text-sm truncate">{formValues.twitter || 'Not specified'}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-neutral-400 mb-1">Telegram</p>
            <p className="font-medium text-sm truncate">{formValues.telegram || 'Not specified'}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-neutral-400 mb-1">LinkedIn</p>
            <p className="font-medium text-sm truncate">{formValues.linkedin || 'Not specified'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
