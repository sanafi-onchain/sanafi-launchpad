import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TermsOfUse() {
  return (
    <>
      <Head>
        <title>Terms of Use - Ethics - Ethical Project Launchpad</title>
        <meta
          name="description"
          content="Terms of Use for Ethics - Ethical Project Launchpad - Please read our comprehensive terms and conditions."
        />
      </Head>

      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="container mx-auto px-4 py-10 flex-1">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">
              Terms of Use for Ethics - Ethical Project Launchpad
            </h1>

            <div className="bg-white/5 rounded-xl p-8 backdrop-blur-sm border border-white/10 space-y-6">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-300">
                  <strong>Last Updated:</strong> July 12, 2025
                </p>
              </div>

              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Welcome to Ethics - Ethical Project Launchpad ("Ethics," "we," "us," or "our"), a
                  decentralized platform built on the Solana blockchain, leveraging Meteora's
                  Dynamic Bonding Curve (DBC) technology to facilitate ethical and transparent token
                  launches. By accessing or using our website, platform, smart contracts, or any
                  related services (collectively, the "Platform"), you ("User," "you," or "your")
                  agree to be bound by these Terms of Use ("Terms"). If you do not agree with these
                  Terms, you must not access or use the Platform.
                </p>
              </div>

              <section>
                <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-300 leading-relaxed">
                  These Terms govern your use of the Platform and constitute a legally binding
                  agreement between you and Ethics. By accessing the Platform, participating in
                  token launches, providing liquidity, or engaging in any other activities on the
                  Platform, you acknowledge that you have read, understood, and agree to comply with
                  these Terms. We may update these Terms at our discretion, and the updated version
                  will be effective upon posting on our website. Continued use of the Platform after
                  such changes constitutes your acceptance of the revised Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Eligibility</h2>
                <p className="text-gray-300 leading-relaxed mb-4">To use the Platform, you must:</p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>
                    Be at least 18 years old or the age of legal majority in your jurisdiction.
                  </li>
                  <li>
                    Not be located in, or be a resident of, any jurisdiction where accessing or
                    using the Platform would be prohibited or restricted, including but not limited
                    to the United States, China, or any country subject to comprehensive sanctions
                    by the U.S. Office of Foreign Assets Control (OFAC) or equivalent authorities.
                  </li>
                  <li>
                    Not be a person or entity listed on any sanctions list, including the OFAC
                    Specially Designated Nationals (SDN) list or similar.
                  </li>
                  <li>
                    Comply with all applicable laws, regulations, and ordinances in your
                    jurisdiction, including those related to cryptocurrencies, securities, and
                    taxation.
                  </li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  By using the Platform, you represent and warrant that you meet these eligibility
                  requirements. Ethics reserves the right to restrict access to the Platform based
                  on jurisdictional or other legal considerations.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. Platform Overview and Services</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Ethics is a decentralized launchpad on the Solana blockchain designed to support
                  ethical and transparent token launches. Utilizing Meteora's Dynamic Bonding Curve
                  (DBC) technology, the Platform enables:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>
                    <strong>Token Launches:</strong> Projects can create and launch tokens with fair
                    and transparent pricing mechanisms via Meteora DBC, ensuring equitable access
                    for investors.
                  </li>
                  <li>
                    <strong>Liquidity Provision:</strong> Users can provide liquidity to token
                    pools, earning dynamic fees based on Meteora's real-time fee adjustment model.
                  </li>
                  <li>
                    <strong>Community Governance:</strong> Token holders may participate in
                    decentralized governance to propose and vote on platform improvements, subject
                    to the Platform's governance framework.
                  </li>
                  <li>
                    <strong>Ethical Standards:</strong> Projects listed on Ethics are vetted for
                    alignment with our ethical criteria, including transparency, community benefit,
                    and sustainable tokenomics.
                  </li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  The Platform operates on Solana's high-speed, low-cost blockchain and integrates
                  with Meteora's liquidity protocols to maximize capital efficiency and user
                  rewards. All transactions are executed via smart contracts, and Ethics does not
                  custody user funds.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. User Responsibilities</h2>
                <p className="text-gray-300 leading-relaxed mb-4">As a User, you agree to:</p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>
                    <strong>Provide Accurate Information:</strong> Submit accurate and complete
                    information during any registration processes, if required.
                  </li>
                  <li>
                    <strong>Secure Your Wallet:</strong> Maintain the security of your
                    Solana-compatible wallet (e.g., Phantom) and private keys. Ethics is not
                    responsible for losses due to compromised wallets or unauthorized access.
                  </li>
                  <li>
                    <strong>Comply with Laws:</strong> Ensure your use of the Platform complies with
                    all applicable laws, including tax reporting and securities regulations.
                  </li>
                  <li>
                    <strong>Conduct Due Diligence:</strong> Independently research and assess the
                    risks of participating in token launches or liquidity pools. Ethics does not
                    provide financial advice.
                  </li>
                  <li>
                    <strong>Ethical Conduct:</strong> Refrain from engaging in fraudulent,
                    manipulative, or harmful activities, including market manipulation,
                    front-running, or deploying malicious smart contracts.
                  </li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  You acknowledge that cryptocurrency investments are high-risk and may result in
                  total loss of funds. Past performance is not indicative of future results.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Risks and Disclaimers</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Using the Platform involves significant risks, including but not limited to:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>
                    <strong>Market Volatility:</strong> Cryptocurrencies and tokens are highly
                    volatile, and their value may fluctuate dramatically.
                  </li>
                  <li>
                    <strong>Smart Contract Risks:</strong> While audited, smart contracts may
                    contain bugs or vulnerabilities that could lead to the loss of funds.
                  </li>
                  <li>
                    <strong>Impermanent Loss:</strong> Providing liquidity to pools may result in
                    impermanent loss if token prices diverge significantly.
                  </li>
                  <li>
                    <strong>Regulatory Risks:</strong> Changes in laws or regulations may impact the
                    Platform's operations or your ability to participate.
                  </li>
                  <li>
                    <strong>Technical Risks:</strong> Solana blockchain outages, network congestion,
                    or third-party wallet issues may disrupt access to the Platform.
                  </li>
                  <li>
                    <strong>Project Risks:</strong> Token projects launched on Ethics may fail,
                    become illiquid, or be scams, despite our vetting process.
                  </li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  Ethics does not guarantee the success, value, or liquidity of any token or
                  project. You participate at your own risk and should consult with financial,
                  legal, and tax advisors before engaging with the Platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Prohibited Activities</h2>
                <p className="text-gray-300 leading-relaxed mb-4">You agree not to:</p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>
                    Use the Platform for illegal purposes, including money laundering, terrorist
                    financing, or fraud.
                  </li>
                  <li>
                    Attempt to hack, exploit, or interfere with the Platform, its smart contracts,
                    or the Solana blockchain.
                  </li>
                  <li>Engage in activities that manipulate token prices or mislead other users.</li>
                  <li>
                    Violate intellectual property rights or misuse proprietary content from the
                    Platform.
                  </li>
                  <li>Impersonate any person or entity or provide false information.</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  Ethics reserves the right to suspend or terminate your access to the Platform for
                  violating these Terms or engaging in prohibited activities.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Fees and Payments</h2>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>
                    <strong>Platform Fees:</strong> Ethics may charge fees for token launches,
                    liquidity provision, or other services, as disclosed on the Platform. Fees are
                    subject to change and will be communicated.
                  </li>
                  <li>
                    <strong>Meteora DBC Fees:</strong> Dynamic fees for liquidity pools are
                    determined by Meteora's algorithms, based on market conditions and pool
                    volatility.
                  </li>
                  <li>
                    <strong>Gas Fees:</strong> Users are responsible for Solana network transaction
                    fees, which vary based on network activity.
                  </li>
                  <li>
                    <strong>Payment Terms:</strong> All payments are made in supported
                    cryptocurrencies (e.g., SOL, USDC) via Solana wallets. Ethics does not accept
                    fiat currency.
                  </li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  No refunds are provided for fees or contributions to token launches, except as
                  required by applicable law.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. Intellectual Property</h2>
                <p className="text-gray-300 leading-relaxed">
                  All content, trademarks, logos, and software on the Platform are the property of
                  Ethics or its licensors and are protected by intellectual property laws. You may
                  not reproduce, distribute, or modify any content without prior written consent,
                  except as permitted for personal, non-commercial use.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">9. Privacy and Data Protection</h2>
                <p className="text-gray-300 leading-relaxed">
                  Ethics collects minimal personal data, primarily wallet addresses and transaction
                  details, to operate the Platform. We comply with applicable data protection laws,
                  such as the General Data Protection Regulation (GDPR), where relevant. For
                  details, refer to our Privacy Policy, available on our website. You consent to the
                  collection and use of your data as described therein.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">10. Limitation of Liability</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  To the fullest extent permitted by law, Ethics, its affiliates, and its team
                  members shall not be liable for any direct, indirect, incidental, consequential,
                  or punitive damages arising from:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Your use of or inability to use the Platform.</li>
                  <li>
                    Losses from token investments, liquidity provision, or smart contract failures.
                  </li>
                  <li>Unauthorized access to your wallet or funds.</li>
                  <li>
                    Errors, delays, or interruptions in the Solana blockchain or third-party
                    services.
                  </li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  The Platform is provided "as is" and "as available," without warranties of any
                  kind, express or implied, including fitness for a particular purpose or
                  non-infringement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">11. Indemnification</h2>
                <p className="text-gray-300 leading-relaxed">
                  You agree to indemnify and hold harmless Ethics, its affiliates, officers,
                  directors, employees, and agents from any claims, losses, damages, or liabilities,
                  including legal fees, arising from your use of the Platform, violation of these
                  Terms, or infringement of any third-party rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">
                  12. Governing Law and Dispute Resolution
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  These Terms are governed by the laws of [Insert Jurisdiction]. Any disputes
                  arising from these Terms shall be resolved through binding arbitration in [Insert
                  Jurisdiction] under the rules of [Insert Arbitration Body]. Arbitration shall be
                  conducted in English, and the arbitrator's decision shall be final and enforceable
                  in any court of competent jurisdiction. You waive any right to participate in
                  class actions or collective arbitration.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">13. Termination</h2>
                <p className="text-gray-300 leading-relaxed">
                  Ethics may suspend or terminate your access to the Platform at any time, with or
                  without notice, for reasons including but not limited to violation of these Terms,
                  suspected illegal activity, or operational requirements. Upon termination, your
                  right to use the Platform ceases; however, the provisions of these Terms regarding
                  liability, indemnification, and dispute resolution shall survive.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">14. Miscellaneous</h2>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>
                    <strong>Entire Agreement:</strong> These Terms, along with the Privacy Policy,
                    constitute the entire agreement between you and Ethics regarding the Platform.
                  </li>
                  <li>
                    <strong>Severability:</strong> If any provision of these Terms is deemed invalid
                    or unenforceable, the remaining provisions remain in effect.
                  </li>
                  <li>
                    <strong>No Waiver:</strong> Failure to enforce any provision does not constitute
                    a waiver of that provision.
                  </li>
                  <li>
                    <strong>Assignment:</strong> You may not assign your rights or obligations under
                    these Terms without our consent. Ethics may assign its rights at its discretion.
                  </li>
                  <li>
                    <strong>Force Majeure:</strong> Ethics is not liable for delays or failures due
                    to events beyond our control, such as blockchain outages or regulatory changes.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">15. Contact Us</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  For questions or concerns about these Terms, contact us at:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
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
                <p className="text-gray-300 leading-relaxed mt-4">
                  By using Ethics - Ethical Project Launchpad, you agree to these Terms and commit
                  to engaging with the Platform in a responsible and ethical manner.
                </p>
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
