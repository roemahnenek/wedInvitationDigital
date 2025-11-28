import dbConnect from '@/lib/db';
import Order from '@/models/order';
import ModernJavaneseTemplate from '@/components/templates/modern-javanese/ModernJavaneseTemplate';
import ListStyleTemplate from '@/components/templates/list-style/ListStyleTemplate';
import SundaTemplate from '@/components/templates/sunda/SundaTemplate';
import { notFound } from 'next/navigation';

// This is the mapping from templateId to the actual component
const templates = {
    'modern-javanese': ModernJavaneseTemplate,
    'list-style': ListStyleTemplate,
    'sunda': SundaTemplate,
    // Add other templates here in the future
    // 'classic-elegant': ClassicElegantTemplate,
};

async function getInvitationData(slug) {
    await dbConnect();
    // Using lean() for performance since we're just reading data
    const invitation = await Order.findOne({ slug }).lean();
    if (!invitation) {
        return null;
    }
    // Mongoose might return BSON types that are not serializable by Next.js (like ObjectId, Date)
    // We need to ensure the object is plain JSON.
    return JSON.parse(JSON.stringify(invitation));
}

export default async function InvitationPage({ params }) {
    const { slug } = params;
    const invitationData = await getInvitationData(slug);

    if (!invitationData) {
        notFound(); // This will render the not-found.js file or a default 404 page
    }

    const SelectedTemplate = templates[invitationData.templateId];

    if (!SelectedTemplate) {
        // Handle case where template ID is invalid
        return <div>Error: Template not found for this invitation.</div>;
    }
    
    // The public API path for guests is different for each invitation
    // It could be something like `/api/invitations/${invitationData._id}/guests`
    // For now, we'll stick to the general one, but this needs to be considered.
    const guestApiPath = `/api/guests`; 

    return <SelectedTemplate invitationData={invitationData} apiPath={guestApiPath} />;
}

// Optional: Generate static paths if you have a known set of invitations
// export async function generateStaticParams() {
//   await dbConnect();
//   const orders = await Order.find({}, 'slug').lean();
//   return orders.map((order) => ({
//     slug: order.slug,
//   }));
// }

// Optional: Add metadata to the page
export async function generateMetadata({ params }) {
    const { slug } = params;
    const invitationData = await getInvitationData(slug);
  
    if (!invitationData) {
      return {
        title: 'Invitation Not Found',
      };
    }
  
    return {
      title: `The Wedding of ${invitationData.bride.name} & ${invitationData.groom.name}`,
      description: `You are invited to the wedding of ${invitationData.bride.name} and ${invitationData.groom.name}.`,
    };
  }
