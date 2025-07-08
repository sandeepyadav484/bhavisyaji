import React from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';

const PrivacyPolicyPage: React.FC = () => (
  <Container maxWidth="md" sx={{ py: 6 }}>
    <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Privacy Policy
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Typography variant="body1" paragraph>
          Welcome to Bhavishyaji. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, store, and protect your data when you use our website and services.
        </Typography>
        <Typography variant="h6" sx={{ mt: 3 }}>1. Information We Collect</Typography>
        <Typography variant="body1" paragraph>
          We may collect personal information such as your name, phone number, date of birth, gender, location, and other details you provide during registration or while using our services. Some information, like your phone number, is required for account verification. Other details, such as your date of birth, are optional but help us personalize your experience.
        </Typography>
        <Typography variant="h6" sx={{ mt: 3 }}>2. Use of Information</Typography>
        <Typography variant="body1" paragraph>
          We use your information to create your profile, provide personalized astrology services, improve our offerings, and communicate with you. Your data may also be used for research, analytics, and to enhance your experience on Bhavishyaji.
        </Typography>
        <Typography variant="h6" sx={{ mt: 3 }}>3. Data Security</Typography>
        <Typography variant="body1" paragraph>
          We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, or misuse. All sensitive data, including payment details, is encrypted and securely transmitted.
        </Typography>
        <Typography variant="h6" sx={{ mt: 3 }}>4. Data Sharing</Typography>
        <Typography variant="body1" paragraph>
          We do not sell or rent your personal information to third parties. Your data may be shared only with trusted partners or service providers as necessary to deliver our services, or if required by law.
        </Typography>
        <Typography variant="h6" sx={{ mt: 3 }}>5. Cookies & Analytics</Typography>
        <Typography variant="body1" paragraph>
          We use cookies and analytics tools to understand how you use our website and to improve your experience. You can manage your cookie preferences in your browser settings.
        </Typography>
        <Typography variant="h6" sx={{ mt: 3 }}>6. Children’s Privacy</Typography>
        <Typography variant="body1" paragraph>
          Bhavishyaji is intended for users above 18 years of age. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal data, please contact us for prompt removal.
        </Typography>
        <Typography variant="h6" sx={{ mt: 3 }}>7. Your Choices & Rights</Typography>
        <Typography variant="body1" paragraph>
          You may review, update, or delete your profile information at any time. To delete your account, please use the account settings or contact our support team.
        </Typography>
        <Typography variant="h6" sx={{ mt: 3 }}>8. Changes to This Policy</Typography>
        <Typography variant="body1" paragraph>
          We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.
        </Typography>
        <Typography variant="h6" sx={{ mt: 3 }}>9. Contact Us</Typography>
        <Typography variant="body1" paragraph>
          If you have any questions or concerns about this Privacy Policy or your data, please contact us at <a href="mailto:support@bhavishyaji.com">support@bhavishyaji.com</a>.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          Effective Date: {new Date().toLocaleDateString()}
        </Typography>
      </Box>
    </Paper>
  </Container>
);

export default PrivacyPolicyPage; 