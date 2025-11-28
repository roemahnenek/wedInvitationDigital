import ModernJavaneseTemplate from '@/components/templates/modern-javanese/ModernJavaneseTemplate';
import ListStyleTemplate from '@/components/templates/list-style/ListStyleTemplate';
import SundaTemplate from '@/components/templates/sunda/SundaTemplate';

const templates = {
    'modern-javanese': ModernJavaneseTemplate,
    'list-style': ListStyleTemplate,
    'sunda': SundaTemplate,
};

const sampleData = {
    bride: { name: "Sarah", parents: "Daughter of Mr. & Mrs. Anderson", photoUrl: "" },
    groom: { name: "Michael", parents: "Son of Mr. & Mrs. Johnson", photoUrl: "" },
    weddingDate: new Date('2025-12-25'),
    events: [
        {
            title: 'Holy Matrimony',
            date: 'Saturday, December 25, 2025',
            time: '10:00 AM',
            venueName: 'St. Mary Church',
            venueAddress: '123 Church Street, New York, NY 10001',
            venueMapUrl: 'https://maps.google.com'
        },
        {
            title: 'Wedding Reception',
            date: 'Saturday, December 25, 2025',
            time: '6:00 PM',
            venueName: 'Grand Ballroom Hotel',
            venueAddress: '456 Hotel Avenue, New York, NY 10002',
            venueMapUrl: 'https://maps.google.com'
        }
    ],
    gallery: [
        { url: 'https://via.placeholder.com/400', caption: 'Our First Date' },
        { url: 'https://via.placeholder.com/400', caption: 'Proposal Day' },
        { url: 'https://via.placeholder.com/400', caption: 'Engagement' },
        { url: 'https://via.placeholder.com/400', caption: 'Together' }
    ],
    story: [
        { year: '2020', title: 'First Met', text: 'We met at a coffee shop on a rainy day. It was love at first sight.' },
        { year: '2022', title: 'First Date', text: 'Our first official date was at an Italian restaurant downtown.' },
        { year: '2024', title: 'The Proposal', text: 'He proposed on the beach at sunset, and she said yes!' }
    ],
    heroQuote: 'Two souls with but a single thought, two hearts that beat as one.',
    hashtag: '#SarahAndMichael2025',
    audioUrl: '',
    coverImage: '',
    showGiftSection: true,
    giftMessage: 'Your presence is the greatest gift, but if you wish to bless us with a gift, we would be grateful.',
    bankAccounts: [
        { bankName: 'Bank of America', accountHolder: 'Sarah Anderson', accountNumber: '1234567890' },
        { bankName: 'Chase Bank', accountHolder: 'Michael Johnson', accountNumber: '0987654321' }
    ]
};

export default function PreviewPage({ params }) {
    const { templateId } = params;
    const SelectedTemplate = templates[templateId];

    if (!SelectedTemplate) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Template Not Found</h1>
                    <p className="text-gray-600">The template you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    return <SelectedTemplate invitationData={sampleData} apiPath="/api/guests" />;
}
