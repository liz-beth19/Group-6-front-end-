import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// System knowledge base
const systemKnowledge = {
  platform: "Future Transitions - Career Development Platform",
  features: [
    "Job Applications - Browse and apply for job opportunities",
    "Career Roadmaps - Plan your professional development journey", 
    "Mentorship - Connect with industry professionals",
    "Calendar - Track important dates and events",
    "Profile Management - Manage your account and settings",
    "Support Chat - Get help from our support team"
  ],
  navigation: {
    "Dashboard": "Main hub with overview, applications, and quick access",
    "Opportunities": "Browse job openings from various companies",
    "Apply": "Submit job applications with required documents",
    "Calendar": "View upcoming events and important dates",
    "Mentorship": "Connect with mentors for career guidance",
    "Roadmaps": "Explore career development paths",
    "Profile": "Manage your account settings and information",
    "Chat": "Get support from our team"
  },
  commonIssues: {
    "login": "Use the Register page to create an account or contact support",
    "password": "Contact support for password reset or use demo password: Innovate2025!",
    "application": "Go to Dashboard → Opportunities → Select job → Click Apply",
    "upload": "Ensure files are PDF format and under 5MB",
    "calendar": "Events are automatically synced from your applications",
    "mentorship": "Browse available mentors in the Mentorship section"
  }
};

// AI Chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, userId, conversationId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const aiResponse = generateSmartResponse(message);
    
    res.json({
      reply: aiResponse,
      status: 'success',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({ 
      error: 'AI service temporarily unavailable',
      reply: "I'm here to help! How can I assist you today?"
    });
  }
});

function generateSmartResponse(message: string): string {
  const lower = message.toLowerCase();
  
  // Greeting responses
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return `Hello! Welcome to ${systemKnowledge.platform}. I'm your AI assistant and I'm here to help you navigate our career development platform. What would you like to know about?`;
  }
  
  // Help requests
  if (lower.includes('help') || lower.includes('what can you do')) {
    return `I can help you with:\n\n${systemKnowledge.features.map(f => `• ${f}`).join('\n')}\n\nJust ask me about any of these features or how to use them!`;
  }
  
  // Navigation help
  if (lower.includes('where') || lower.includes('how to find') || lower.includes('navigate')) {
    const navHelp = Object.entries(systemKnowledge.navigation)
      .map(([key, value]) => `• **${key}**: ${value}`)
      .join('\n');
    return `Here's how to navigate our platform:\n\n${navHelp}\n\nIs there a specific section you're looking for?`;
  }
  
  // Job application help
  if (lower.includes('apply') || lower.includes('application') || lower.includes('job')) {
    return `To apply for jobs:\n\n1. Go to **Dashboard → Opportunities**\n2. Browse available job openings\n3. Click on a job that interests you\n4. Click the **Apply** button\n5. Fill out the application form\n6. Upload required documents (PDF format)\n7. Submit your application\n\nYou can track your applications in the **Applications** section of your dashboard.`;
  }
  
  // Login/Account help
  if (lower.includes('login') || lower.includes('password') || lower.includes('account')) {
    return `For account issues:\n\n• **New User**: Use the Register page to create an account\n• **Forgot Password**: Contact our support team\n• **Demo Access**: Use password "Innovate2025!"\n• **Account Settings**: Go to Dashboard → Profile\n\nNeed more help? Our support team is available through this chat!`;
  }
  
  // Calendar help
  if (lower.includes('calendar') || lower.includes('event') || lower.includes('schedule')) {
    return `The Calendar feature helps you:\n\n• View upcoming events and deadlines\n• Track application due dates\n• Manage your schedule\n• Set reminders for important tasks\n\nAccess it from your Dashboard. Events are automatically synced from your job applications.`;
  }
  
  // Mentorship help
  if (lower.includes('mentor') || lower.includes('mentorship') || lower.includes('guidance')) {
    return `Our Mentorship program connects you with industry professionals:\n\n• Browse available mentors in **Dashboard → Mentorship**\n• Find mentors in your field of interest\n• Get career guidance and advice\n• Build professional relationships\n\nThis is a great way to advance your career!`;
  }
  
  // Roadmaps help
  if (lower.includes('roadmap') || lower.includes('career path') || lower.includes('development')) {
    return `Career Roadmaps help you plan your professional journey:\n\n• Explore different career paths\n• See required skills and qualifications\n• Plan your learning journey\n• Set career goals\n\nCheck out **Dashboard → Roadmaps** to get started!`;
  }
  
  // Profile help
  if (lower.includes('profile') || lower.includes('settings') || lower.includes('account')) {
    return `Manage your profile in **Dashboard → Profile**:\n\n• Update personal information\n• Change password\n• Manage notifications\n• Update contact details\n• View account statistics\n\nKeep your profile updated for better job matching!`;
  }
  
  // Support/Contact
  if (lower.includes('contact') || lower.includes('support') || lower.includes('problem')) {
    return `I'm here to help! For additional support:\n\n• Use this chat for immediate assistance\n• Our admin team monitors all conversations\n• We typically respond within 24 hours\n• For urgent issues, mention "URGENT" in your message\n\nWhat specific issue are you experiencing?`;
  }
  
  // Thank you responses
  if (lower.includes('thank') || lower.includes('thanks')) {
    return `You're very welcome! I'm happy to help. Is there anything else you'd like to know about our platform?`;
  }
  
  // Default response
  return `I understand you're asking about "${message}". Let me help you with that!\n\nOur platform offers several features:\n\n${systemKnowledge.features.map(f => `• ${f}`).join('\n')}\n\nCould you be more specific about what you need help with? For example:\n• "How do I apply for jobs?"\n• "Where can I find mentors?"\n• "How do I update my profile?"\n\nI'm here to guide you through our platform!`;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`AI Chat server running on port ${PORT}`);
});

export default app;
