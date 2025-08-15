import React from 'react';
import { Award, Download, Share2, Calendar, User, BookOpen } from 'lucide-react';
import type { Certificate as CertificateType } from '../types';

interface CertificateProps {
  certificate: CertificateType;
  onClose: () => void;
}

const Certificate: React.FC<CertificateProps> = ({ certificate, onClose }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const downloadCertificate = () => {
    // In a real app, this would generate and download a PDF
    // For demo, we'll create a canvas element and download as image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    canvas.width = 1200;
    canvas.height = 800;
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Certificate border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
    
    // Inner border
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);
    
    // Text styling
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    
    // Title
    ctx.font = 'bold 48px serif';
    ctx.fillText('Certificate of Completion', canvas.width / 2, 180);
    
    // Subtitle
    ctx.font = '24px serif';
    ctx.fillText('This certifies that', canvas.width / 2, 240);
    
    // Student name
    ctx.font = 'bold 42px serif';
    ctx.fillText(certificate.courseName, canvas.width / 2, 320); // Using courseName as placeholder
    
    // Course completion text
    ctx.font = '24px serif';
    ctx.fillText('has successfully completed the course', canvas.width / 2, 380);
    
    // Course title
    ctx.font = 'bold 36px serif';
    ctx.fillText(`"${certificate.courseName}"`, canvas.width / 2, 440);
    
    // Instructor
    ctx.font = '22px serif';
    ctx.fillText(`Instructed by ${certificate.instructorName}`, canvas.width / 2, 500);
    
    // Score
    ctx.font = 'bold 24px serif';
    ctx.fillText(`Final Score: ${certificate.score}%`, canvas.width / 2, 560);
    
    // Date and certificate number
    ctx.font = '20px serif';
    ctx.fillText(`Issued on ${formatDate(certificate.issuedAt)}`, canvas.width / 2, 620);
    ctx.fillText(`Certificate #${certificate.certificateNumber}`, canvas.width / 2, 650);
    
    // Skillset branding
    ctx.font = 'bold 28px serif';
    ctx.fillText('Skillset Academy', canvas.width / 2, 720);
    
    // Download the image
    const link = document.createElement('a');
    link.download = `skillset-certificate-${certificate.certificateNumber}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const shareCertificate = async () => {
    const shareData = {
      title: 'Skillset Certificate',
      text: `I just completed "${certificate.courseName}" with a score of ${certificate.score}% and earned my Skillset certificate!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      const text = `🎓 I just completed "${certificate.courseName}" with a score of ${certificate.score}% and earned my Skillset certificate! #SkillsetAcademy #OnlineLearning`;
      navigator.clipboard.writeText(text);
      alert('Certificate text copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Certificate of Completion</h2>
                <p className="text-primary-100">Congratulations on your achievement!</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Certificate Display */}
        <div className="p-8">
          <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-primary-600 rounded-xl p-12 text-white text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-12 -translate-y-12"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -translate-x-10 translate-y-10"></div>
            <div className="absolute bottom-0 right-0 w-28 h-28 bg-white/10 rounded-full translate-x-14 translate-y-14"></div>
            
            {/* Certificate content */}
            <div className="relative z-10">
              <div className="border-4 border-white/20 rounded-lg p-8 backdrop-blur-sm bg-white/5">
                <h1 className="text-4xl font-bold mb-6">Certificate of Completion</h1>
                
                <div className="w-16 h-1 bg-white mx-auto mb-6"></div>
                
                <p className="text-xl mb-4">This certifies that</p>
                
                <div className="bg-white/20 rounded-lg p-4 mb-6">
                  <p className="text-2xl font-bold">Course Graduate</p>
                  <p className="text-sm opacity-80">Certificate Holder</p>
                </div>
                
                <p className="text-lg mb-4">has successfully completed the course</p>
                
                <h2 className="text-3xl font-bold mb-6 text-yellow-200">"{certificate.courseName}"</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <User className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm opacity-80">Instructor</p>
                    <p className="font-semibold">{certificate.instructorName}</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4">
                    <Award className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm opacity-80">Final Score</p>
                    <p className="font-semibold text-xl">{certificate.score}%</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4">
                    <Calendar className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm opacity-80">Date Issued</p>
                    <p className="font-semibold">{formatDate(certificate.issuedAt)}</p>
                  </div>
                </div>
                
                <div className="border-t border-white/20 pt-6">
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <BookOpen className="h-8 w-8" />
                    <span className="text-2xl font-bold">Skillset Academy</span>
                  </div>
                  <p className="text-sm opacity-80">Certificate #{certificate.certificateNumber}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={downloadCertificate}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              <Download className="h-5 w-5" />
              <span>Download Certificate</span>
            </button>
            
            <button
              onClick={shareCertificate}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Share2 className="h-5 w-5" />
              <span>Share Achievement</span>
            </button>
            
            <button
              onClick={onClose}
              className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              🎉 Congratulations! Add this certificate to your LinkedIn profile and resume.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;