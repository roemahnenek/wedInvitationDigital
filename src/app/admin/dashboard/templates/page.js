"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Eye, ArrowLeft, Smartphone, Monitor } from 'lucide-react';

const templates = [
    {
        id: 'modern-javanese',
        name: 'Modern Javanese Wedding',
        description: 'Elegant and traditional Javanese wedding template with modern touches. Features Islamic quotes, beautiful gradients, and sophisticated animations.',
        features: [
            'Full-screen hero section',
            'Couple information with photos',
            'Multiple event support',
            'Photo gallery',
            'Love story timeline',
            'RSVP form',
            'Gift/Bank account section',
            'Background music player'
        ],
        colors: ['#92400e', '#451a03', '#d97706'],
        previewImage: '/previews/modern-javanese.png',
        style: 'Traditional & Elegant'
    },
    {
        id: 'list-style',
        name: 'Simple List Style',
        description: 'Clean, modern, and mobile-first design with expandable sections. Perfect for minimalist couples who prefer simplicity.',
        features: [
            'Accordion-style sections',
            'Mobile-optimized layout',
            'Minimalist design',
            'Easy navigation',
            'RSVP form',
            'Gift section',
            'Background music player'
        ],
        colors: ['#292524', '#57534e', '#78716c'],
        previewImage: '/previews/list-style.png',
        style: 'Modern & Minimalist'
    },
    {
        id: 'sunda',
        name: 'Sunda Wedding',
        description: 'Beautiful Sundanese wedding template with emerald green theme and traditional Sundanese language. Features cover image support for landing page.',
        features: [
            'Cover image background',
            'Sundanese language text',
            'Full-screen hero section',
            'Couple information with photos',
            'Multiple event support',
            'Photo gallery',
            'RSVP form',
            'Gift/Bank account section'
        ],
        colors: ['#047857', '#065f46', '#064e3b'],
        previewImage: '/previews/sunda.png',
        style: 'Traditional & Cultural'
    }
];

export default function TemplatesPage() {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [viewMode, setViewMode] = useState('mobile');

    const openPreview = (templateId) => {
        setSelectedTemplate(templateId);
    };

    const closePreview = () => {
        setSelectedTemplate(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard/invitations" className="text-gray-600 hover:text-gray-900 transition">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Template Gallery</h1>
                        <p className="text-sm text-gray-500">Browse and preview available invitation templates</p>
                    </div>
                </div>
            </div>

            {/* Template Grid */}
            {!selectedTemplate ? (
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.map((template) => (
                            <div key={template.id} className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-[1.02]">
                                {/* Preview Image */}
                                <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-6xl mb-2">💍</div>
                                            <p className="text-gray-400 text-sm font-medium">{template.name}</p>
                                        </div>
                                    </div>
                                    {/* Color Palette */}
                                    <div className="absolute bottom-0 left-0 right-0 flex h-4">
                                        {template.colors.map((color, idx) => (
                                            <div key={idx} style={{ backgroundColor: color }} className="flex-1"></div>
                                        ))}
                                    </div>
                                </div>

                                {/* Template Info */}
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                                            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                                                {template.style}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{template.description}</p>
                                    
                                    {/* Features */}
                                    <div className="mb-5">
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Features</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {template.features.slice(0, 4).map((feature, idx) => (
                                                <span key={idx} className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full border border-gray-100">
                                                    {feature}
                                                </span>
                                            ))}
                                            {template.features.length > 4 && (
                                                <span className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full border border-gray-100">
                                                    +{template.features.length - 4} more
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openPreview(template.id)}
                                            className="flex-1 bg-gray-900 text-white px-4 py-3 rounded-full hover:bg-gray-800 transition-all flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg"
                                        >
                                            <Eye size={18} />
                                            Preview
                                        </button>
                                        <Link
                                            href={`/admin/dashboard/invitations/create?template=${template.id}`}
                                            className="flex-1 bg-amber-600 text-white px-4 py-3 rounded-full hover:bg-amber-700 transition-all text-center font-medium shadow-md hover:shadow-lg"
                                        >
                                            Use Template
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                /* Preview Modal */
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
                        {/* Preview Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {templates.find(t => t.id === selectedTemplate)?.name}
                                </h2>
                                <p className="text-sm text-gray-500">Template Preview</p>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* View Mode Toggle */}
                                <div className="flex bg-gray-100 rounded-full p-1">
                                    <button
                                        onClick={() => setViewMode('mobile')}
                                        className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm transition-all ${
                                            viewMode === 'mobile' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-600'
                                        }`}
                                    >
                                        <Smartphone size={16} />
                                        Mobile
                                    </button>
                                    <button
                                        onClick={() => setViewMode('desktop')}
                                        className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm transition-all ${
                                            viewMode === 'desktop' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-600'
                                        }`}
                                    >
                                        <Monitor size={16} />
                                        Desktop
                                    </button>
                                </div>
                                <button
                                    onClick={closePreview}
                                    className="px-5 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all font-medium"
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        {/* Preview Content */}
                        <div className="flex-1 overflow-auto bg-gray-100 p-6">
                            <div className={`mx-auto bg-white shadow-2xl ${viewMode === 'mobile' ? 'max-w-md' : 'w-full'} rounded-3xl overflow-hidden`}>
                                <iframe
                                    src={`/preview/${selectedTemplate}`}
                                    className="w-full h-[600px] border-0"
                                    title="Template Preview"
                                />
                            </div>
                        </div>

                        {/* Preview Footer */}
                        <div className="p-6 border-t border-gray-200 bg-gray-50">
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-600">
                                    Like this template? Use it to create your invitation.
                                </p>
                                <Link
                                    href={`/admin/dashboard/invitations/create?template=${selectedTemplate}`}
                                    className="bg-amber-600 text-white px-6 py-3 rounded-full hover:bg-amber-700 transition-all font-medium shadow-lg hover:shadow-xl"
                                >
                                    Use This Template
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
