import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as XLSX from 'xlsx';

const outputDirectory = fileURLToPath(new URL('../../public/templates/', import.meta.url));

const templates = [
  {
    filename: 'services-template.xlsx',
    columns: ['name_en', 'name_ar', 'category', 'description_en', 'description_ar'],
    example: [
      'Example Service',
      'اسم الخدمة',
      'Treatment',
      'Replace with approved service information.',
      'استبدل بمعلومات الخدمة المعتمدة.',
    ],
  },
  {
    filename: 'prices-template.xlsx',
    columns: ['service_name_en', 'price', 'currency'],
    example: ['Example Service', 0, 'AED'],
  },
  {
    filename: 'offers-template.xlsx',
    columns: ['title_en', 'title_ar', 'description_en', 'description_ar', 'valid_until', 'is_active'],
    example: [
      'Example Offer',
      'عرض تجريبي',
      'Replace with approved offer details.',
      'استبدل بتفاصيل العرض المعتمدة.',
      'YYYY-MM-DD',
      true,
    ],
  },
  {
    filename: 'quick-replies-template.xlsx',
    columns: ['category', 'title_en', 'title_ar', 'body_en', 'body_ar', 'tags'],
    example: [
      'General',
      'Example reply',
      'رد تجريبي',
      'Replace with approved reply text.',
      'استبدل بنص الرد المعتمد.',
      'example, placeholder',
    ],
  },
  {
    filename: 'call-flow-template.xlsx',
    columns: ['step_order', 'label_en', 'label_ar', 'content_en', 'content_ar', 'tip_en', 'tip_ar'],
    example: [
      1,
      'Opening',
      'الترحيب',
      'Replace with approved call-flow wording.',
      'استبدل بصياغة مسار المكالمة المعتمدة.',
      'Add an agent coaching tip.',
      'أضف نصيحة للموظف.',
    ],
  },
];

await mkdir(outputDirectory, { recursive: true });

for (const template of templates) {
  const worksheet = XLSX.utils.aoa_to_sheet([template.columns, template.example]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
  XLSX.writeFile(workbook, path.join(outputDirectory, template.filename));
  console.log(`Generated public/templates/${template.filename}`);
}
