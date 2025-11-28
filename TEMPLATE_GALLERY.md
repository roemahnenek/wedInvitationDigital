# Template Gallery Feature

## Overview
Halaman Template Gallery memungkinkan user untuk melihat dan preview semua template undangan yang tersedia sebelum membuat undangan baru.

## Files Created

### 1. `/src/app/admin/dashboard/templates/page.js`
Halaman utama untuk menampilkan gallery template.

**Features:**
- Grid view dari semua template yang tersedia
- Informasi detail setiap template (nama, deskripsi, fitur, style)
- Color palette preview
- Button "Preview" untuk melihat template secara detail
- Button "Use Template" untuk langsung membuat undangan dengan template tersebut

### 2. `/src/app/preview/[templateId]/page.js`
Halaman untuk menampilkan preview template dengan sample data.

**Features:**
- Render template dengan data contoh
- Digunakan dalam iframe di modal preview
- Support untuk semua template yang ada

### 3. Updated Files
- `/src/app/admin/dashboard/invitations/page.js` - Menambahkan button "Browse Templates"
- `/src/app/admin/dashboard/invitations/create/page.js` - Support query parameter `?template=xxx`

## How to Use

### Untuk User:
1. Buka dashboard invitations (`/admin/dashboard/invitations`)
2. Klik button "Browse Templates"
3. Lihat semua template yang tersedia
4. Klik "Preview" untuk melihat detail template
5. Toggle antara view Mobile dan Desktop
6. Klik "Use This Template" untuk membuat undangan dengan template tersebut

### Untuk Developer - Menambah Template Baru:

1. **Buat component template** di `/src/components/templates/[nama-template]/`
2. **Register template** di beberapa file:

```javascript
// Di /src/app/admin/dashboard/templates/page.js
const templates = [
    // ... existing templates
    {
        id: 'nama-template-baru',
        name: 'Nama Template',
        description: 'Deskripsi template...',
        features: ['Feature 1', 'Feature 2'],
        colors: ['#color1', '#color2'],
        style: 'Style Category'
    }
];

// Di /src/app/preview/[templateId]/page.js
import NamaTemplateBaru from '@/components/templates/nama-template-baru/NamaTemplateBaru';

const templates = {
    'nama-template-baru': NamaTemplateBaru,
    // ... existing templates
};

// Di /src/app/v/[slug]/page.js
import NamaTemplateBaru from '@/components/templates/nama-template-baru/NamaTemplateBaru';

const templates = {
    'nama-template-baru': NamaTemplateBaru,
    // ... existing templates
};

// Di /src/app/admin/dashboard/invitations/create/page.js
const templates = [
    { id: 'nama-template-baru', name: 'Nama Template' },
    // ... existing templates
];
```

## Template Structure

Setiap template component harus menerima props:
```javascript
{
    invitationData: {
        bride: { name, parents, photoUrl },
        groom: { name, parents, photoUrl },
        weddingDate: Date,
        events: Array,
        gallery: Array,
        story: Array,
        heroQuote: String,
        hashtag: String,
        audioUrl: String,
        bankAccounts: Array,
        showGiftSection: Boolean,
        giftMessage: String
    },
    apiPath: String // untuk RSVP submission
}
```

## Current Templates

1. **Modern Javanese Wedding** (`modern-javanese`)
   - Full-screen elegant design
   - Islamic quotes
   - Multiple sections with smooth scrolling
   - Gradient backgrounds

2. **Simple List Style** (`list-style`)
   - Mobile-first accordion design
   - Minimalist and clean
   - Expandable sections
   - Perfect for simple invitations

## Navigation Flow

```
Dashboard → Browse Templates → Preview Template → Use Template → Create Invitation
     ↓                                                    ↓
Create New (direct) ────────────────────────────────────→
```

## URLs

- Template Gallery: `/admin/dashboard/templates`
- Template Preview: `/preview/[templateId]`
- Create with Template: `/admin/dashboard/invitations/create?template=[templateId]`
