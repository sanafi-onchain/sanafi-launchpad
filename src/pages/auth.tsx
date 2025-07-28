import { GetServerSideProps } from 'next';
import { useState, useRef } from 'react';
import Head from 'next/head';
import { z } from 'zod';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useForm } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { parse } from 'cookie';
import bcrypt from 'bcryptjs';
import { useRouter } from 'next/router';

// Define the schema for form validation
const formAuth = z.object({
  username: z.string(),
  password: z.string(),
});

interface FormValues {
  username: string;
  password: string;
}

export default function Auth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState({
    message: '',
    success: '',
  });

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    } as FormValues,
    onSubmit: async ({ value }) => {
      console.log('masuk submit => ', value);
      try {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(value),
        }).then((res) => res.json());
        setResponse(response);
      } catch (error) {
      } finally {
        setIsLoading(false);
        router.reload();
      }
    },
    validators: {
      onSubmit: formAuth,
    },
  });

  return (
    <>
      <Head>
        <title>Auth - Virtual Curve</title>
        <meta name="description" content="Authorization first" />
      </Head>

      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="container mx-auto px-4 py-10 flex-1">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-8"
          >
            {/* Loading Overlay */}
            {isLoading && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-white/10 p-8 rounded-xl border border-white/20 flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-t-primary border-white/30 rounded-full animate-spin mb-4"></div>
                  <p className="text-white text-lg font-medium">Auth process...</p>
                  <p className="text-white/70 text-sm mt-2">Please don&apos;t close this page</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center">
              {/* Token Details Section */}
              <div className="bg-white/5 rounded-xl p-8 backdrop-blur-sm border border-white/10 w-1/3">
                <h2 className="text-2xl font-bold mb-4">Auth</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <div className="mb-4">
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Username*
                      </label>
                      {form.Field({
                        name: 'username',
                        children: (field) => (
                          <input
                            id="username"
                            name={field.name}
                            type="text"
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                            placeholder="username ..."
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={isLoading}
                            required
                            minLength={3}
                          />
                        ),
                      })}
                    </div>

                    <div className="mb-8">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Password*
                      </label>
                      {form.Field({
                        name: 'password',
                        children: (field) => (
                          <input
                            id="password"
                            name={field.name}
                            type="text"
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                            placeholder="password ..."
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={isLoading}
                            required
                            minLength={3}
                          />
                        ),
                      })}
                    </div>
                    <div>
                      <Button
                        className="w-full cursor-pointer bg-primary px-6 py-3 rounded-xl font-medium hover:opacity-90 hover:scale-105 active:scale-95 transition-all text-black"
                        type="submit"
                      >
                        Login
                      </Button>
                    </div>
                    {!!response?.message && (
                      <div
                        className={`bg-${!!response.success ? 'green' : 'red'}-500/20 border border-${!!response.success ? 'green' : 'red'}-500/50 rounded-lg p-4 space-y-2 mt-8`}
                      >
                        <div className="flex items-start gap-2">
                          <p className={`text-${!!response.success ? 'green' : 'red'}-200`}>
                            {response.message}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  // read credentials from env
  const username = process.env.SANAFI_USERNAME!;
  const password = process.env.SANAFI_PASSWORD!;

  // read cookies
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const token = cookies['sana_auth'] || '';

  // check and validation
  const isValidToken = await bcrypt.compare(`${username},${password}`, `$2a$12$U.${token}`);
  const isStaging = process.env.SANAFI_NODE_ENV === 'staging';

  // if node env != staging redirect to home '/'
  if (!isStaging) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // if token valid redirect to home '/'
  if (isValidToken) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
