import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - Ethics - Ethical Project Launchpad</title>
        <meta
          name="description"
          content="Privacy Policy for Ethics - Ethical Project Launchpad. Learn how we protect and handle your data on our decentralized platform."
        />
      </Head>

      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="container mx-auto px-4 py-10 flex-1">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">
              Privacy Policy for Ethics - Ethical Project Launchpad
            </h1>

            <div className="bg-white/5 rounded-xl p-8 backdrop-blur-sm border border-white/10 space-y-6">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-300">
                  <strong>Last Updated:</strong> July 12, 2025
                </p>
              </div>

              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  This Privacy Policy ("Policy") describes how Ethics - Ethical Project Launchpad
                  ("Ethics," "we," "us," or "our"), a decentralized platform built on the Solana
                  blockchain, collects, uses, discloses, and protects information in connection with
                  our website, smart contracts, and related services (collectively, the "Platform").
                  By accessing or using the Platform, you ("User," "you," or "your") consent to the
                  practices described in this Policy. If you do not agree, please do not use the
                  Platform.
                </p>

                <p>
                  Ethics is committed to protecting your privacy. As a decentralized platform, we do
                  not maintain user accounts, custody funds, or collect traditional personal
                  information. Most interactions occur on the Solana blockchain, which is public and
                  pseudonymous. This Policy explains our limited data practices and how we handle
                  any information we may collect.
                </p>
              </div>

              <section>
                <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                <div className="text-gray-300 leading-relaxed space-y-4">
                  <p>
                    We collect minimal information to operate and improve the Platform. We do not
                    collect personally identifiable information (PII) such as names, email
                    addresses, physical addresses, or phone numbers unless voluntarily provided
                    (e.g., via contact forms). The types of information we may collect include:
                  </p>

                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Blockchain Data:</strong> When you connect your Solana-compatible
                      wallet (e.g., Phantom), we may access and log your public wallet address and
                      on-chain transaction details. This data is publicly available on the Solana
                      blockchain and is not created or assigned by us. We use it to facilitate token
                      launches, liquidity provision, and to analyze aggregate usage patterns.
                    </li>
                    <li>
                      <strong>Device and Usage Information:</strong> Through cookies, local storage,
                      or similar technologies, we may collect non-identifying information such as
                      browser type, device type, operating system, language preferences, and
                      interaction data (e.g., pages visited, time spent). This helps us improve the
                      user experience and troubleshoot issues.
                    </li>
                    <li>
                      <strong>Correspondence and Voluntary Submissions:</strong> If you contact us
                      via email, Telegram, or our website (e.g., support inquiries or feedback), we
                      collect the information you provide, such as your email address or message
                      content. We do not link this to your wallet address or other data.
                    </li>
                    <li>
                      <strong>Aggregated Analytics:</strong> We may use third-party analytics tools
                      to collect anonymized data on Platform usage, such as the number of visitors
                      or transaction volumes, to enhance features and performance.
                    </li>
                    <li>
                      <strong>Other Sources:</strong> In rare cases, we may receive data from
                      third-party providers (e.g., blockchain analytics for compliance) to detect
                      fraudulent activity.
                    </li>
                  </ul>

                  <p>
                    We do not collect sensitive personal data, and providing any personal
                    information is optional and not required to use the Platform.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                <div className="text-gray-300 leading-relaxed space-y-4">
                  <p>
                    We use the collected information solely for legitimate purposes related to the
                    Platform, including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Providing and Improving Services:</strong> To enable token launches,
                      liquidity pools, and governance features; customize the user interface; and
                      analyze trends to enhance functionality.
                    </li>
                    <li>
                      <strong>Security and Compliance:</strong> To detect, prevent, and investigate
                      fraudulent, unauthorized, or illegal activities; comply with legal
                      obligations; and protect the Platform, users, and the Solana ecosystem.
                    </li>
                    <li>
                      <strong>Communication:</strong> To respond to your inquiries, provide updates
                      (if you opt-in), or send administrative information.
                    </li>
                    <li>
                      <strong>Analytics and Research:</strong> To create aggregated, anonymized
                      statistics for internal research and Platform optimization.
                    </li>
                    <li>
                      <strong>Legal Purposes:</strong> As required by law, such as responding to
                      subpoenas, court orders, or regulatory requests.
                    </li>
                  </ul>
                  <p>
                    We do not use your information for marketing purposes without explicit consent,
                    and we never sell your data.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">
                  3. Sharing and Disclosure of Information
                </h2>
                <div className="text-gray-300 leading-relaxed space-y-4">
                  <p>We may share information in limited circumstances:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Service Providers:</strong> With third-party vendors (e.g., hosting
                      providers, analytics tools like Google Analytics, or blockchain services) who
                      assist in operating the Platform, bound by confidentiality and data protection
                      obligations.
                    </li>
                    <li>
                      <strong>Legal and Regulatory Compliance:</strong> To government authorities,
                      law enforcement, or regulators if required by law, or to enforce our Terms of
                      Use and protect rights, property, or safety.
                    </li>
                    <li>
                      <strong>Business Transfers:</strong> In the event of a merger, acquisition, or
                      asset sale, your information may be transferred to the acquiring entity.
                    </li>
                    <li>
                      <strong>With Your Consent:</strong> For any other purpose disclosed at the
                      time of collection or with your explicit approval.
                    </li>
                  </ul>
                  <p>
                    We do not share personal data with advertisers or third parties for targeted
                    advertising. On-chain data (e.g., wallet addresses) is inherently public on the
                    Solana blockchain and may be accessible to anyone.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
                <div className="text-gray-300 leading-relaxed space-y-4">
                  <p>
                    We implement reasonable technical and organizational measures to protect the
                    information we control from unauthorized access, loss, or disclosure. However:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      As a decentralized platform, most data resides on the public Solana
                      blockchain, which we do not control. Blockchain data is immutable and visible
                      to all network participants.
                    </li>
                    <li>
                      You are responsible for securing your wallet and private keys. We do not have
                      access to or custody of your funds or keys.
                    </li>
                    <li>
                      No system is completely secure, and we cannot guarantee absolute security,
                      especially against sophisticated attacks or blockchain vulnerabilities.
                    </li>
                  </ul>
                  <p>
                    If we become aware of a data breach affecting information we control, we will
                    notify affected users as required by law.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Your Rights and Choices</h2>
                <div className="text-gray-300 leading-relaxed space-y-4">
                  <p>
                    Depending on your jurisdiction (e.g., under GDPR for EU residents or similar
                    laws), you may have rights regarding your personal data, including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Access:</strong> Request details about the information we hold about
                      you.
                    </li>
                    <li>
                      <strong>Correction:</strong> Update inaccurate or incomplete data.
                    </li>
                    <li>
                      <strong>Deletion:</strong> Request removal of your data (note: on-chain data
                      cannot be deleted due to blockchain immutability).
                    </li>
                    <li>
                      <strong>Objection:</strong> Object to certain processing activities.
                    </li>
                    <li>
                      <strong>Withdrawal of Consent:</strong> Revoke consent where processing relies
                      on it.
                    </li>
                    <li>
                      <strong>Portability:</strong> Receive your data in a structured format.
                    </li>
                  </ul>
                  <p>
                    To exercise these rights, contact us at the details below. We will respond
                    within applicable timeframes. You can also manage cookies via your browser
                    settings or opt out of analytics tools.
                  </p>
                  <p>
                    For GDPR compliance: If applicable, we process data based on legitimate
                    interests (e.g., Platform operation) or consent. You can lodge complaints with
                    your local data protection authority.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. International Data Transfers</h2>
                <p className="text-gray-300 leading-relaxed">
                  The Platform operates globally, and data may be processed in jurisdictions outside
                  your own (e.g., servers in the US or EU). We ensure appropriate safeguards, such
                  as standard contractual clauses, for transfers to countries without adequate data
                  protection laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Children's Privacy</h2>
                <p className="text-gray-300 leading-relaxed">
                  The Platform is not intended for children under 13 (or 16 in some regions). We do
                  not knowingly collect data from minors. If we learn of such collection, we will
                  delete it promptly.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. Changes to This Policy</h2>
                <p className="text-gray-300 leading-relaxed">
                  We may update this Policy to reflect changes in our practices, technology, or
                  legal requirements. Updates will be posted on our website with the revised "Last
                  Updated." Continued use of the Platform after changes constitutes acceptance. For
                  material changes, we may provide additional notice.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
                <div className="text-gray-300 leading-relaxed space-y-2">
                  <p>If you have questions about this Policy or your data, contact:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                      <strong>Email:</strong>{' '}
                      <a
                        href="mailto:support@ethics.ltd"
                        className="text-primary hover:text-primary/80 underline"
                      >
                        support@ethics.ltd
                      </a>
                    </li>
                    <li>
                      <strong>Website:</strong>{' '}
                      <a
                        href="https://www.ethics.ltd"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 underline"
                      >
                        www.ethics.ltd
                      </a>
                    </li>
                    <li>
                      <strong>Telegram:</strong>{' '}
                      <a
                        href="https://t.me/ethicslaunch"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 underline"
                      >
                        t.me/ethicslaunch
                      </a>
                    </li>
                  </ul>
                  <p className="mt-4">
                    By using Ethics - Ethical Project Launchpad, you acknowledge our privacy
                    practices and agree to this Policy.
                  </p>
                </div>
              </section>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-8">
                <p className="text-sm text-gray-300">
                  <strong>Last Updated:</strong> July 12, 2025
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
