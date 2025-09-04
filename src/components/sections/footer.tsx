import Link from "next/link"

export default function Footer() {
  return (
    <footer className="footer-light-background py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Navigation Links */}
        <div className="flex justify-center space-x-8 mb-8">
          <Link href="mailto:hi@limitlessconcepts.xyz" className="text-dark-background hover:text-primary-green transition-colors">
            Contact
          </Link>
          <Link href="https://sso.teachable.com/secure/1539380/identity/login/password" className="text-dark-background hover:text-primary-green transition-colors">
            Log In
          </Link>
          <Link href="/terms" className="text-dark-background hover:text-primary-green transition-colors">
            Terms of Use
          </Link>
          <Link href="/privacy" className="text-dark-background hover:text-primary-green transition-colors">
            Privacy Policy
          </Link>
        </div>

        {/* Disclaimer Text */}
        <div className="max-w-4xl mx-auto">
          <p className="text-xs leading-relaxed text-gray-600">
            <strong>Disclaimer:</strong> Causal Ventures LLC, doing business as Limitless Concepts, asserts ownership and exclusive rights to the digital product(s), including associated files, documentation, and content (collectively, the &apos;Product&apos;). The Product is protected under copyright laws and international treaties, as well as other intellectual property regulations. You are granted a limited, non-exclusive, non-transferable license to utilize the Product for personal or internal business purposes, subject to specified terms and conditions. This license may be terminated for non-compliance. Any reproduction, distribution, modification, reverse engineering, or creation of derivative works without prior written consent is strictly prohibited. Removal or alteration of copyright notices is prohibited. The Product is provided &apos;as is,&apos; without warranties, and we disclaim all liability for damages. This information is for informational purposes only and not meant to be financial or legal advice in any way. All usage is governed by the laws of the United States of America. For inquiries, contact hi@limitlessconcepts.xyz
          </p>
        </div>
      </div>
    </footer>
  )
}