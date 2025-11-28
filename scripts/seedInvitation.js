// scripts/seedInvitation.js
require('dotenv').config({ path: './.env.local' });
const mongoose = require('mongoose');

const User = require('../src/models/User').default;
const Order = require('../src/models/order').default;
const dbConnect = require('../src/lib/db').default;

const ADMIN_EMAIL = 'admin@roemahnenek.com';
const INVITATION_SLUG = 'jasmine-dan-bayu';

const seedInvitation = async () => {
    try {
        await dbConnect();
        console.log('Database connected.');

        const adminUser = await User.findOne({ email: ADMIN_EMAIL });
        if (!adminUser) {
            console.error(`Admin user with email ${ADMIN_EMAIL} not found. Please seed the admin user first by running 'npm run db:seed:admin'.`);
            return;
        }
        console.log(`Found admin user: ${adminUser.name}`);

        const sampleInvitationData = {
            slug: INVITATION_SLUG,
            templateId: 'modern-javanese',
            createdBy: adminUser._id,
                        groom: {
                            name: 'Bayu',
                            parents: `Putra Ketiga dari
            Bapak (Alm) H. Mulyadi
            &
            Ibu Nonoy Suryati`,
                        },
                        bride: {
                            name: 'Jasmine',
                            parents: `Putri Pertama dari
            Bapak (Alm) Yoyo Sucahyo
            &
            Ibu Lina Raeny`,
                        },            weddingDate: new Date('2026-11-12T10:00:00'),
            events: [
                {
                    title: 'Akad Nikah',
                    date: 'Saturday, November 12, 2026',
                    time: '10:00 WIB',
                    venueName: 'Kediaman Mempelai Wanita',
                    venueAddress: 'Jl. Mayor Dasuki, Desa Penganjang Rt 07/Rw 03, Kec. Sindang, Kab. Indramayu',
                    venueMapUrl: 'https://maps.app.goo.gl/xxx', // Replace with a real Google Maps link
                },
                {
                    title: 'Resepsi Pernikahan',
                    date: 'Saturday, November 12, 2026',
                    time: '11:00 WIB - Selesai',
                    venueName: 'Kediaman Mempelai Wanita',
                    venueAddress: 'Jl. Mayor Dasuki, Desa Penganjang Rt 07/Rw 03, Kec. Sindang, Kab. Indramayu',
                    venueMapUrl: 'https://maps.app.goo.gl/xxx',
                },
            ],
            dressCodeInfo: 'We kindly encourage our guests to wear Black, Dark Grey, or Gold Accent.',
            heroQuote: '"And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy."',
            hashtag: '#JasmineBayuWedding',
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            gallery: [
                { url: '/placeholder.jpg', caption: 'Casual moments' },
                { url: '/placeholder.jpg', caption: 'Traditional elegance' },
            ],
            story: [
                { year: '2020', title: 'First Meeting', text: 'Our paths crossed for the first time' },
                { year: '2022', title: 'Growing Together', text: 'Learning and growing in love' },
                { year: '2024', title: 'The Proposal', text: 'He asked, she said yes!' },
                { year: '2026', title: 'Forever Begins', text: 'Our wedding day' }
            ],
            showGiftSection: true,
            giftMessage: 'Your presence is the greatest gift of all. However, if you wish to honor us with a gift, we would be grateful for a contribution to our future together.',
            bankAccounts: [
                { bankName: 'BCA', accountHolder: 'Fauziah Jasmine', accountNumber: '1234567890' },
                { bankName: 'Mandiri', accountHolder: 'Bayu Tri Astanto', accountNumber: '0987654321' },
            ],
        };

        console.log(`Upserting sample invitation with slug: ${INVITATION_SLUG}`);
        await Order.findOneAndUpdate(
            { slug: INVITATION_SLUG },
            sampleInvitationData,
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        console.log('Sample invitation seeded successfully!');
        console.log(`You can now view it at: /v/${INVITATION_SLUG}`);

    } catch (error) {
        console.error('Error seeding sample invitation:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Database connection closed.');
    }
};

seedInvitation();
