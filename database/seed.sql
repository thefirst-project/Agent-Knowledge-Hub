-- Placeholder seed data derived from src/data. Prices are intentionally zero until approved.

INSERT INTO branches (name_en, name_ar, city_en, city_ar)
SELECT 'Handsome & Pretty Abu Dhabi', 'هاندسم آند بريتي أبوظبي', 'Abu Dhabi', 'أبوظبي'
WHERE NOT EXISTS (SELECT 1 FROM branches WHERE name_en = 'Handsome & Pretty Abu Dhabi');

INSERT INTO branches (name_en, name_ar, city_en, city_ar)
SELECT 'Tres Jolie Fujairah', 'تريز جولي الفجيرة', 'Fujairah', 'الفجيرة'
WHERE NOT EXISTS (SELECT 1 FROM branches WHERE name_en = 'Tres Jolie Fujairah');

INSERT INTO services (branch_id, name_en, name_ar, category, description_en, description_ar)
SELECT NULL::INTEGER, 'Laser Hair Removal', 'إزالة الشعر بالليزر', 'Treatment', 'Laser hair removal uses controlled pulses of light to target the pigment in hair follicles. Over a course of treatments, the follicles become less active and hair growth is reduced.', 'تستخدم إزالة الشعر بالليزر نبضات ضوئية مضبوطة لاستهداف صبغة بصيلات الشعر، مما يساعد على تقليل نمو الشعر تدريجياً.'
WHERE NOT EXISTS (SELECT 1 FROM services s WHERE s.branch_id IS NULL AND s.name_en = 'Laser Hair Removal');

INSERT INTO services (branch_id, name_en, name_ar, category, description_en, description_ar)
SELECT NULL::INTEGER, 'Botox', 'البوتوكس', 'Treatment', 'Botox is a purified botulinum toxin treatment that temporarily relaxes selected facial muscles. This can soften expression lines while preserving a natural-looking result when performed by a qualified professional.', 'البوتوكس علاج يحتوي على توكسين البوتولينوم المنقى، ويعمل مؤقتاً على إرخاء عضلات وجه محددة لتنعيم الخطوط مع الحفاظ على مظهر طبيعي.'
WHERE NOT EXISTS (SELECT 1 FROM services s WHERE s.branch_id IS NULL AND s.name_en = 'Botox');

INSERT INTO services (branch_id, name_en, name_ar, category, description_en, description_ar)
SELECT NULL::INTEGER, 'Hydrafacial', 'هيدرافيشل', 'Treatment', 'Hydrafacial is a non-invasive facial treatment combining cleansing, gentle exfoliation, extraction, and hydration. It is tailored with professional-grade serums to leave skin looking fresh and luminous.', 'الهيدرافيشل علاج غير جراحي يجمع بين التنظيف والتقشير اللطيف والاستخراج والترطيب، مع أمصال مهنية تناسب احتياجات البشرة.'
WHERE NOT EXISTS (SELECT 1 FROM services s WHERE s.branch_id IS NULL AND s.name_en = 'Hydrafacial');

INSERT INTO services (branch_id, name_en, name_ar, category, description_en, description_ar)
SELECT NULL::INTEGER, 'Sculptra', 'سكولبترا', 'Treatment', 'Sculptra is an injectable treatment containing poly-L-lactic acid that helps stimulate the skin’s own collagen production. Results develop gradually and can improve the appearance of facial volume and skin quality.', 'سكولبترا علاج قابل للحقن يحتوي على حمض البولي-لاكتيك، ويساعد البشرة على تحفيز إنتاج الكولاجين الخاص بها تدريجياً.'
WHERE NOT EXISTS (SELECT 1 FROM services s WHERE s.branch_id IS NULL AND s.name_en = 'Sculptra');

INSERT INTO services (branch_id, name_en, name_ar, category, description_en, description_ar)
SELECT NULL::INTEGER, 'Dermapen', 'ديرمابن', 'Treatment', 'Dermapen uses fine sterile needles to create controlled micro-channels in the skin. This stimulates the skin renewal process and can support improvements in texture, tone, and the appearance of certain scars.', 'يستخدم ديرمابن إبرًا دقيقة ومعقمة لإنشاء قنوات صغيرة مضبوطة في البشرة، مما يدعم عملية التجدد وتحسين الملمس واللون ومظهر بعض الندبات.'
WHERE NOT EXISTS (SELECT 1 FROM services s WHERE s.branch_id IS NULL AND s.name_en = 'Dermapen');

INSERT INTO media (service_id, title_en, title_ar, caption_en, caption_ar, thumbnail_url, full_url, download_url, file_type, tags)
SELECT s.id, 'Treatment media placeholder', 'عنصر نائب لوسائط العلاج', 'Placeholder visual for this treatment. Replace with approved clinic media.', 'صورة توضيحية مؤقتة لهذا العلاج. استبدلها بوسائط معتمدة من العيادة.', 'https://picsum.photos/seed/laser-treatment/400/300', 'https://picsum.photos/seed/laser-treatment/800/600', 'https://picsum.photos/seed/laser-treatment/800/600', 'image', ARRAY[]::TEXT[]
FROM services s WHERE s.name_en = 'Laser Hair Removal' AND NOT EXISTS (SELECT 1 FROM media m WHERE m.service_id = s.id AND m.title_en = 'Treatment media placeholder' AND m.full_url = 'https://picsum.photos/seed/laser-treatment/800/600');

INSERT INTO media (service_id, title_en, title_ar, caption_en, caption_ar, thumbnail_url, full_url, download_url, file_type, tags)
SELECT s.id, 'Treatment video placeholder', 'عنصر نائب لفيديو العلاج', 'Placeholder video for demonstration. Replace with approved clinic media.', 'فيديو مؤقت للعرض التوضيحي. استبدله بوسائط معتمدة من العيادة.', 'https://img.youtube.com/vi/AQn8hCvSVfo/hqdefault.jpg', 'https://www.youtube.com/embed/AQn8hCvSVfo?playsinline=1&rel=0', 'https://www.youtube.com/shorts/AQn8hCvSVfo', 'video', ARRAY[]::TEXT[]
FROM services s WHERE s.name_en = 'Laser Hair Removal' AND NOT EXISTS (SELECT 1 FROM media m WHERE m.service_id = s.id AND m.title_en = 'Treatment video placeholder' AND m.full_url = 'https://www.youtube.com/embed/AQn8hCvSVfo?playsinline=1&rel=0');

INSERT INTO media (service_id, title_en, title_ar, caption_en, caption_ar, thumbnail_url, full_url, download_url, file_type, tags)
SELECT s.id, 'Treatment media placeholder', 'عنصر نائب لوسائط العلاج', 'Placeholder visual for this treatment. Replace with approved clinic media.', 'صورة توضيحية مؤقتة لهذا العلاج. استبدلها بوسائط معتمدة من العيادة.', 'https://picsum.photos/seed/botox-treatment/400/300', 'https://picsum.photos/seed/botox-treatment/800/600', 'https://picsum.photos/seed/botox-treatment/800/600', 'image', ARRAY[]::TEXT[]
FROM services s WHERE s.name_en = 'Botox' AND NOT EXISTS (SELECT 1 FROM media m WHERE m.service_id = s.id AND m.title_en = 'Treatment media placeholder' AND m.full_url = 'https://picsum.photos/seed/botox-treatment/800/600');

INSERT INTO media (service_id, title_en, title_ar, caption_en, caption_ar, thumbnail_url, full_url, download_url, file_type, tags)
SELECT s.id, 'Treatment video placeholder', 'عنصر نائب لفيديو العلاج', 'Placeholder video for demonstration. Replace with approved clinic media.', 'فيديو مؤقت للعرض التوضيحي. استبدله بوسائط معتمدة من العيادة.', 'https://img.youtube.com/vi/AQn8hCvSVfo/hqdefault.jpg', 'https://www.youtube.com/embed/AQn8hCvSVfo?playsinline=1&rel=0', 'https://www.youtube.com/shorts/AQn8hCvSVfo', 'video', ARRAY[]::TEXT[]
FROM services s WHERE s.name_en = 'Botox' AND NOT EXISTS (SELECT 1 FROM media m WHERE m.service_id = s.id AND m.title_en = 'Treatment video placeholder' AND m.full_url = 'https://www.youtube.com/embed/AQn8hCvSVfo?playsinline=1&rel=0');

INSERT INTO media (service_id, title_en, title_ar, caption_en, caption_ar, thumbnail_url, full_url, download_url, file_type, tags)
SELECT s.id, 'Treatment media placeholder', 'عنصر نائب لوسائط العلاج', 'Placeholder visual for this treatment. Replace with approved clinic media.', 'صورة توضيحية مؤقتة لهذا العلاج. استبدلها بوسائط معتمدة من العيادة.', 'https://picsum.photos/seed/hydrafacial-treatment/400/300', 'https://picsum.photos/seed/hydrafacial-treatment/800/600', 'https://picsum.photos/seed/hydrafacial-treatment/800/600', 'image', ARRAY[]::TEXT[]
FROM services s WHERE s.name_en = 'Hydrafacial' AND NOT EXISTS (SELECT 1 FROM media m WHERE m.service_id = s.id AND m.title_en = 'Treatment media placeholder' AND m.full_url = 'https://picsum.photos/seed/hydrafacial-treatment/800/600');

INSERT INTO media (service_id, title_en, title_ar, caption_en, caption_ar, thumbnail_url, full_url, download_url, file_type, tags)
SELECT s.id, 'Treatment video placeholder', 'عنصر نائب لفيديو العلاج', 'Placeholder video for demonstration. Replace with approved clinic media.', 'فيديو مؤقت للعرض التوضيحي. استبدله بوسائط معتمدة من العيادة.', 'https://img.youtube.com/vi/AQn8hCvSVfo/hqdefault.jpg', 'https://www.youtube.com/embed/AQn8hCvSVfo?playsinline=1&rel=0', 'https://www.youtube.com/shorts/AQn8hCvSVfo', 'video', ARRAY[]::TEXT[]
FROM services s WHERE s.name_en = 'Hydrafacial' AND NOT EXISTS (SELECT 1 FROM media m WHERE m.service_id = s.id AND m.title_en = 'Treatment video placeholder' AND m.full_url = 'https://www.youtube.com/embed/AQn8hCvSVfo?playsinline=1&rel=0');

INSERT INTO media (service_id, title_en, title_ar, caption_en, caption_ar, thumbnail_url, full_url, download_url, file_type, tags)
SELECT s.id, 'Treatment media placeholder', 'عنصر نائب لوسائط العلاج', 'Placeholder visual for this treatment. Replace with approved clinic media.', 'صورة توضيحية مؤقتة لهذا العلاج. استبدلها بوسائط معتمدة من العيادة.', 'https://picsum.photos/seed/sculptra-treatment/400/300', 'https://picsum.photos/seed/sculptra-treatment/800/600', 'https://picsum.photos/seed/sculptra-treatment/800/600', 'image', ARRAY[]::TEXT[]
FROM services s WHERE s.name_en = 'Sculptra' AND NOT EXISTS (SELECT 1 FROM media m WHERE m.service_id = s.id AND m.title_en = 'Treatment media placeholder' AND m.full_url = 'https://picsum.photos/seed/sculptra-treatment/800/600');

INSERT INTO media (service_id, title_en, title_ar, caption_en, caption_ar, thumbnail_url, full_url, download_url, file_type, tags)
SELECT s.id, 'Treatment video placeholder', 'عنصر نائب لفيديو العلاج', 'Placeholder video for demonstration. Replace with approved clinic media.', 'فيديو مؤقت للعرض التوضيحي. استبدله بوسائط معتمدة من العيادة.', 'https://img.youtube.com/vi/AQn8hCvSVfo/hqdefault.jpg', 'https://www.youtube.com/embed/AQn8hCvSVfo?playsinline=1&rel=0', 'https://www.youtube.com/shorts/AQn8hCvSVfo', 'video', ARRAY[]::TEXT[]
FROM services s WHERE s.name_en = 'Sculptra' AND NOT EXISTS (SELECT 1 FROM media m WHERE m.service_id = s.id AND m.title_en = 'Treatment video placeholder' AND m.full_url = 'https://www.youtube.com/embed/AQn8hCvSVfo?playsinline=1&rel=0');

INSERT INTO media (service_id, title_en, title_ar, caption_en, caption_ar, thumbnail_url, full_url, download_url, file_type, tags)
SELECT s.id, 'Treatment media placeholder', 'عنصر نائب لوسائط العلاج', 'Placeholder visual for this treatment. Replace with approved clinic media.', 'صورة توضيحية مؤقتة لهذا العلاج. استبدلها بوسائط معتمدة من العيادة.', 'https://picsum.photos/seed/dermapen-treatment/400/300', 'https://picsum.photos/seed/dermapen-treatment/800/600', 'https://picsum.photos/seed/dermapen-treatment/800/600', 'image', ARRAY[]::TEXT[]
FROM services s WHERE s.name_en = 'Dermapen' AND NOT EXISTS (SELECT 1 FROM media m WHERE m.service_id = s.id AND m.title_en = 'Treatment media placeholder' AND m.full_url = 'https://picsum.photos/seed/dermapen-treatment/800/600');

INSERT INTO media (service_id, title_en, title_ar, caption_en, caption_ar, thumbnail_url, full_url, download_url, file_type, tags)
SELECT s.id, 'Treatment video placeholder', 'عنصر نائب لفيديو العلاج', 'Placeholder video for demonstration. Replace with approved clinic media.', 'فيديو مؤقت للعرض التوضيحي. استبدله بوسائط معتمدة من العيادة.', 'https://img.youtube.com/vi/AQn8hCvSVfo/hqdefault.jpg', 'https://www.youtube.com/embed/AQn8hCvSVfo?playsinline=1&rel=0', 'https://www.youtube.com/shorts/AQn8hCvSVfo', 'video', ARRAY[]::TEXT[]
FROM services s WHERE s.name_en = 'Dermapen' AND NOT EXISTS (SELECT 1 FROM media m WHERE m.service_id = s.id AND m.title_en = 'Treatment video placeholder' AND m.full_url = 'https://www.youtube.com/embed/AQn8hCvSVfo?playsinline=1&rel=0');

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT NULL::INTEGER, NULL::INTEGER, 1, 'Opening', 'الترحيب', 'Thank you for calling. How may I help you today?', 'شكراً لاتصالك. كيف يمكنني مساعدتك اليوم؟', 'Greet the caller warmly and give them time to explain why they called.', 'رحّب بالمتصل بود واترك له الوقت لشرح سبب اتصاله.'
WHERE NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id IS NULL AND branch_id IS NULL AND step_order = 1);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT NULL::INTEGER, NULL::INTEGER, 2, 'Qualification', 'أسئلة التأهيل', 'Could you tell me what you hope to learn or achieve? Have you spoken with a qualified practitioner about this before?', 'هل يمكنك إخباري بما تود معرفته أو تحقيقه؟ وهل سبق لك التحدث مع مختص مؤهل حول ذلك؟', 'Ask open questions, listen without rushing, and avoid making a suitability decision yourself.', 'اطرح أسئلة مفتوحة واستمع دون استعجال، وتجنب تحديد مدى الملاءمة بنفسك.'
WHERE NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id IS NULL AND branch_id IS NULL AND step_order = 2);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT NULL::INTEGER, NULL::INTEGER, 3, 'Key points', 'النقاط الأساسية', 'I can share general information about the service and what a consultation usually covers. A qualified practitioner can discuss your individual needs and answer clinical questions.', 'يمكنني مشاركة معلومات عامة عن الخدمة وما تتضمنه الاستشارة عادةً. ويمكن لمختص مؤهل مناقشة احتياجاتك والإجابة عن الأسئلة الطبية.', 'Keep information general and refer clinical or personal advice to a qualified practitioner.', 'قدّم معلومات عامة وأحِل النصائح الطبية أو الشخصية إلى مختص مؤهل.'
WHERE NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id IS NULL AND branch_id IS NULL AND step_order = 3);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT NULL::INTEGER, NULL::INTEGER, 4, 'Objection handling', 'التعامل مع الاعتراض', 'I understand that you may want time to consider this. What information would help you feel comfortable deciding on a next step?', 'أتفهم أنك قد ترغب في بعض الوقت للتفكير. ما المعلومات التي قد تساعدك على اتخاذ قرار بشأن الخطوة التالية؟', 'Acknowledge concerns without pressure and answer only within your role.', 'قدّر مخاوف المتصل دون ضغط، وأجب ضمن حدود دورك.'
WHERE NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id IS NULL AND branch_id IS NULL AND step_order = 4);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT NULL::INTEGER, NULL::INTEGER, 5, 'Offer guidance', 'تقديم العرض', 'I can check whether there is a current offer that may be relevant. I will confirm the applicable details before sharing them with you.', 'يمكنني التحقق مما إذا كان هناك عرض حالي قد يناسبك. وسأتأكد من التفاصيل المعمول بها قبل مشاركتها معك.', 'Verify current offer details and terms before describing availability or eligibility.', 'تحقق من تفاصيل العرض الحالي وشروطه قبل توضيح توفره أو أهلية الاستفادة منه.'
WHERE NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id IS NULL AND branch_id IS NULL AND step_order = 5);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT NULL::INTEGER, NULL::INTEGER, 6, 'Center selection', 'اختيار المركز', 'Which location would be most convenient for you? I can check the information available for that center.', 'أي موقع يناسبك أكثر؟ يمكنني التحقق من المعلومات المتاحة لذلك المركز.', 'Confirm the preferred location before checking availability or other details.', 'تأكد من الموقع المفضل قبل التحقق من المواعيد أو التفاصيل الأخرى.'
WHERE NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id IS NULL AND branch_id IS NULL AND step_order = 6);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT NULL::INTEGER, NULL::INTEGER, 7, 'Booking prompt', 'الخطوة التالية', 'Would you like me to help you arrange a consultation or check appointment availability? I can summarize the next steps before we finish.', 'هل ترغب أن أساعدك في ترتيب استشارة أو التحقق من المواعيد المتاحة؟ يمكنني تلخيص الخطوات التالية قبل إنهاء المكالمة.', 'Confirm the caller’s preferred next step and recap any details you have agreed.', 'تأكد من الخطوة التالية التي يفضلها المتصل، ولخّص أي تفاصيل تم الاتفاق عليها.'
WHERE NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id IS NULL AND branch_id IS NULL AND step_order = 7);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 1, 'Opening', 'الترحيب', 'Thank you for asking about laser hair removal. What would you most like to know about the treatment?', 'شكراً لاستفسارك عن إزالة الشعر بالليزر. ما أكثر ما تود معرفته عن العلاج؟', 'Welcome the caller warmly and let them explain what they would like to know.', 'رحّب بالمتصل بود واترك له المجال لشرح ما يود معرفته.' FROM services s WHERE s.name_en = 'Laser Hair Removal'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Laser Hair Removal' ORDER BY id LIMIT 1) AND step_order = 1);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 2, 'Qualification', 'أسئلة التأهيل', 'Which area are you interested in learning about? Have you had a consultation about laser hair removal before?', 'ما المنطقة التي ترغب في معرفة المزيد عنها؟ وهل سبق لك إجراء استشارة حول إزالة الشعر بالليزر؟', 'Ask what the caller wants to understand; do not assess treatment suitability.', 'اسأل عما يرغب المتصل في فهمه، ولا تحدد مدى ملاءمة العلاج.' FROM services s WHERE s.name_en = 'Laser Hair Removal'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Laser Hair Removal' ORDER BY id LIMIT 1) AND step_order = 2);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 3, 'Key points', 'النقاط الأساسية', 'Laser hair removal is generally planned as a course, and individual needs can vary. A qualified practitioner can explain what may be appropriate after assessing the caller.', 'يُخطط لإزالة الشعر بالليزر عادةً كسلسلة من الجلسات، وقد تختلف الاحتياجات من شخص لآخر. ويمكن لمختص مؤهل توضيح ما قد يناسب المتصل بعد تقييمه.', 'Share general information only; leave individual recommendations to a qualified practitioner.', 'شارك معلومات عامة فقط، واترك التوصيات الفردية لمختص مؤهل.' FROM services s WHERE s.name_en = 'Laser Hair Removal'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Laser Hair Removal' ORDER BY id LIMIT 1) AND step_order = 3);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 4, 'Objection handling', 'التعامل مع الاعتراض', 'It is understandable to have questions before deciding. What is your main concern about laser hair removal? I can share general information or help arrange a consultation.', 'من الطبيعي أن تكون لديك أسئلة قبل اتخاذ القرار. ما هو استفسارك الأساسي حول إزالة الشعر بالليزر؟ يمكنني مشاركة معلومات عامة أو المساعدة في ترتيب استشارة.', 'Acknowledge concerns without guarantees or pressure, and offer an appropriate next step.', 'قدّر مخاوف المتصل دون ضمانات أو ضغط، واقترح خطوة تالية مناسبة.' FROM services s WHERE s.name_en = 'Laser Hair Removal'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Laser Hair Removal' ORDER BY id LIMIT 1) AND step_order = 4);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 5, 'Offer guidance', 'تقديم العرض', 'I can check whether there is a current offer related to this service. I will confirm its details and terms before sharing them.', 'يمكنني التحقق مما إذا كان هناك عرض حالي متعلق بهذه الخدمة. وسأتأكد من تفاصيله وشروطه قبل مشاركتها معك.', 'Verify current offers and terms before discussing them.', 'تحقق من العروض الحالية وشروطها قبل مناقشتها.' FROM services s WHERE s.name_en = 'Laser Hair Removal'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Laser Hair Removal' ORDER BY id LIMIT 1) AND step_order = 5);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 6, 'Center selection', 'اختيار المركز', 'Which location would be most convenient for you? I can check the available information for that center.', 'أي موقع يناسبك أكثر؟ يمكنني التحقق من المعلومات المتاحة لذلك المركز.', 'Confirm the preferred location before checking the next steps.', 'تأكد من الموقع المفضل قبل التحقق من الخطوات التالية.' FROM services s WHERE s.name_en = 'Laser Hair Removal'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Laser Hair Removal' ORDER BY id LIMIT 1) AND step_order = 6);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 7, 'Booking prompt', 'الخطوة التالية', 'Would you like help arranging a consultation or checking appointment availability for laser hair removal?', 'هل ترغب في المساعدة على ترتيب استشارة أو التحقق من المواعيد المتاحة لإزالة الشعر بالليزر؟', 'Confirm the caller’s preference and recap the next step before ending the call.', 'تأكد مما يفضله المتصل ولخّص الخطوة التالية قبل إنهاء المكالمة.' FROM services s WHERE s.name_en = 'Laser Hair Removal'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Laser Hair Removal' ORDER BY id LIMIT 1) AND step_order = 7);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 1, 'Opening', 'الترحيب', 'Thank you for asking about Botox. What would you most like to know about the treatment?', 'شكراً لاستفسارك عن البوتوكس. ما أكثر ما تود معرفته عن العلاج؟', 'Welcome the caller warmly and let them explain what they would like to know.', 'رحّب بالمتصل بود واترك له المجال لشرح ما يود معرفته.' FROM services s WHERE s.name_en = 'Botox'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Botox' ORDER BY id LIMIT 1) AND step_order = 1);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 2, 'Qualification', 'أسئلة التأهيل', 'What would you like to address regarding expression lines? Have you discussed this with a qualified practitioner before?', 'ما الذي تود الاستفسار عنه بخصوص الخطوط التعبيرية؟ وهل سبق لك مناقشة ذلك مع مختص مؤهل؟', 'Ask open questions about the caller’s goals; do not assess treatment suitability.', 'اطرح أسئلة مفتوحة حول أهداف المتصل، ولا تحدد مدى ملاءمة العلاج.' FROM services s WHERE s.name_en = 'Botox'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Botox' ORDER BY id LIMIT 1) AND step_order = 2);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 3, 'Key points', 'النقاط الأساسية', 'I can share general information about Botox and what a consultation may cover. A qualified practitioner can discuss your individual needs.', 'يمكنني مشاركة معلومات عامة عن البوتوكس وما قد تتضمنه الاستشارة. ويمكن لمختص مؤهل مناقشة احتياجاتك الفردية.', 'Keep information general and refer individual or clinical questions to a qualified practitioner.', 'قدّم معلومات عامة وأحِل الأسئلة الطبية أو الفردية إلى مختص مؤهل.' FROM services s WHERE s.name_en = 'Botox'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Botox' ORDER BY id LIMIT 1) AND step_order = 3);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 4, 'Objection handling', 'التعامل مع الاعتراض', 'It is understandable to have questions before deciding. What is your main concern? I can share general information or help arrange a consultation.', 'من الطبيعي أن تكون لديك أسئلة قبل اتخاذ القرار. ما هو استفسارك الأساسي؟ يمكنني مشاركة معلومات عامة أو المساعدة في ترتيب استشارة.', 'Acknowledge concerns without guarantees or pressure, and offer an appropriate next step.', 'قدّر مخاوف المتصل دون ضمانات أو ضغط، واقترح خطوة تالية مناسبة.' FROM services s WHERE s.name_en = 'Botox'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Botox' ORDER BY id LIMIT 1) AND step_order = 4);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 5, 'Offer guidance', 'تقديم العرض', 'I can check whether there is a current offer related to this service. I will confirm its details and terms before sharing them.', 'يمكنني التحقق مما إذا كان هناك عرض حالي متعلق بهذه الخدمة. وسأتأكد من تفاصيله وشروطه قبل مشاركتها معك.', 'Verify current offers and terms before discussing them.', 'تحقق من العروض الحالية وشروطها قبل مناقشتها.' FROM services s WHERE s.name_en = 'Botox'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Botox' ORDER BY id LIMIT 1) AND step_order = 5);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 6, 'Center selection', 'اختيار المركز', 'Which location would be most convenient for you? I can check the information available for that center.', 'أي موقع يناسبك أكثر؟ يمكنني التحقق من المعلومات المتاحة لذلك المركز.', 'Confirm the preferred location before checking the next steps.', 'تأكد من الموقع المفضل قبل التحقق من الخطوات التالية.' FROM services s WHERE s.name_en = 'Botox'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Botox' ORDER BY id LIMIT 1) AND step_order = 6);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 7, 'Booking prompt', 'الخطوة التالية', 'Would you like help arranging a consultation or checking appointment availability for Botox?', 'هل ترغب في المساعدة على ترتيب استشارة أو التحقق من المواعيد المتاحة لخدمة البوتوكس؟', 'Confirm the caller’s preference and recap the next step before ending the call.', 'تأكد مما يفضله المتصل ولخّص الخطوة التالية قبل إنهاء المكالمة.' FROM services s WHERE s.name_en = 'Botox'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Botox' ORDER BY id LIMIT 1) AND step_order = 7);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 1, 'Opening', 'الترحيب', 'Thank you for asking about Hydrafacial. What would you most like to know about the treatment?', 'شكراً لاستفسارك عن هيدرافيشل. ما أكثر ما تود معرفته عن العلاج؟', 'Welcome the caller warmly and let them explain what they would like to know.', 'رحّب بالمتصل بود واترك له المجال لشرح ما يود معرفته.' FROM services s WHERE s.name_en = 'Hydrafacial'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Hydrafacial' ORDER BY id LIMIT 1) AND step_order = 1);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 2, 'Qualification', 'أسئلة التأهيل', 'What would you like to address regarding your skin goals and concerns? Have you discussed this with a qualified practitioner before?', 'ما الذي تود الاستفسار عنه بخصوص أهداف بشرتك ومخاوفك؟ وهل سبق لك مناقشة ذلك مع مختص مؤهل؟', 'Ask open questions about the caller’s goals; do not assess treatment suitability.', 'اطرح أسئلة مفتوحة حول أهداف المتصل، ولا تحدد مدى ملاءمة العلاج.' FROM services s WHERE s.name_en = 'Hydrafacial'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Hydrafacial' ORDER BY id LIMIT 1) AND step_order = 2);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 3, 'Key points', 'النقاط الأساسية', 'I can share general information about Hydrafacial and what a consultation may cover. A qualified practitioner can discuss your individual needs.', 'يمكنني مشاركة معلومات عامة عن هيدرافيشل وما قد تتضمنه الاستشارة. ويمكن لمختص مؤهل مناقشة احتياجاتك الفردية.', 'Keep information general and refer individual or clinical questions to a qualified practitioner.', 'قدّم معلومات عامة وأحِل الأسئلة الطبية أو الفردية إلى مختص مؤهل.' FROM services s WHERE s.name_en = 'Hydrafacial'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Hydrafacial' ORDER BY id LIMIT 1) AND step_order = 3);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 4, 'Objection handling', 'التعامل مع الاعتراض', 'It is understandable to have questions before deciding. What is your main concern? I can share general information or help arrange a consultation.', 'من الطبيعي أن تكون لديك أسئلة قبل اتخاذ القرار. ما هو استفسارك الأساسي؟ يمكنني مشاركة معلومات عامة أو المساعدة في ترتيب استشارة.', 'Acknowledge concerns without guarantees or pressure, and offer an appropriate next step.', 'قدّر مخاوف المتصل دون ضمانات أو ضغط، واقترح خطوة تالية مناسبة.' FROM services s WHERE s.name_en = 'Hydrafacial'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Hydrafacial' ORDER BY id LIMIT 1) AND step_order = 4);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 5, 'Offer guidance', 'تقديم العرض', 'I can check whether there is a current offer related to this service. I will confirm its details and terms before sharing them.', 'يمكنني التحقق مما إذا كان هناك عرض حالي متعلق بهذه الخدمة. وسأتأكد من تفاصيله وشروطه قبل مشاركتها معك.', 'Verify current offers and terms before discussing them.', 'تحقق من العروض الحالية وشروطها قبل مناقشتها.' FROM services s WHERE s.name_en = 'Hydrafacial'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Hydrafacial' ORDER BY id LIMIT 1) AND step_order = 5);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 6, 'Center selection', 'اختيار المركز', 'Which location would be most convenient for you? I can check the information available for that center.', 'أي موقع يناسبك أكثر؟ يمكنني التحقق من المعلومات المتاحة لذلك المركز.', 'Confirm the preferred location before checking the next steps.', 'تأكد من الموقع المفضل قبل التحقق من الخطوات التالية.' FROM services s WHERE s.name_en = 'Hydrafacial'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Hydrafacial' ORDER BY id LIMIT 1) AND step_order = 6);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 7, 'Booking prompt', 'الخطوة التالية', 'Would you like help arranging a consultation or checking appointment availability for Hydrafacial?', 'هل ترغب في المساعدة على ترتيب استشارة أو التحقق من المواعيد المتاحة لخدمة هيدرافيشل؟', 'Confirm the caller’s preference and recap the next step before ending the call.', 'تأكد مما يفضله المتصل ولخّص الخطوة التالية قبل إنهاء المكالمة.' FROM services s WHERE s.name_en = 'Hydrafacial'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Hydrafacial' ORDER BY id LIMIT 1) AND step_order = 7);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 1, 'Opening', 'الترحيب', 'Thank you for asking about Sculptra. What would you most like to know about the treatment?', 'شكراً لاستفسارك عن سكولبترا. ما أكثر ما تود معرفته عن العلاج؟', 'Welcome the caller warmly and let them explain what they would like to know.', 'رحّب بالمتصل بود واترك له المجال لشرح ما يود معرفته.' FROM services s WHERE s.name_en = 'Sculptra'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Sculptra' ORDER BY id LIMIT 1) AND step_order = 1);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 2, 'Qualification', 'أسئلة التأهيل', 'What would you like to address regarding your skin goals and questions about gradual treatment? Have you discussed this with a qualified practitioner before?', 'ما الذي تود الاستفسار عنه بخصوص أهداف بشرتك وأسئلتك حول العلاج التدريجي؟ وهل سبق لك مناقشة ذلك مع مختص مؤهل؟', 'Ask open questions about the caller’s goals; do not assess treatment suitability.', 'اطرح أسئلة مفتوحة حول أهداف المتصل، ولا تحدد مدى ملاءمة العلاج.' FROM services s WHERE s.name_en = 'Sculptra'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Sculptra' ORDER BY id LIMIT 1) AND step_order = 2);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 3, 'Key points', 'النقاط الأساسية', 'I can share general information about Sculptra and what a consultation may cover. A qualified practitioner can discuss your individual needs.', 'يمكنني مشاركة معلومات عامة عن سكولبترا وما قد تتضمنه الاستشارة. ويمكن لمختص مؤهل مناقشة احتياجاتك الفردية.', 'Keep information general and refer individual or clinical questions to a qualified practitioner.', 'قدّم معلومات عامة وأحِل الأسئلة الطبية أو الفردية إلى مختص مؤهل.' FROM services s WHERE s.name_en = 'Sculptra'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Sculptra' ORDER BY id LIMIT 1) AND step_order = 3);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 4, 'Objection handling', 'التعامل مع الاعتراض', 'It is understandable to have questions before deciding. What is your main concern? I can share general information or help arrange a consultation.', 'من الطبيعي أن تكون لديك أسئلة قبل اتخاذ القرار. ما هو استفسارك الأساسي؟ يمكنني مشاركة معلومات عامة أو المساعدة في ترتيب استشارة.', 'Acknowledge concerns without guarantees or pressure, and offer an appropriate next step.', 'قدّر مخاوف المتصل دون ضمانات أو ضغط، واقترح خطوة تالية مناسبة.' FROM services s WHERE s.name_en = 'Sculptra'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Sculptra' ORDER BY id LIMIT 1) AND step_order = 4);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 5, 'Offer guidance', 'تقديم العرض', 'I can check whether there is a current offer related to this service. I will confirm its details and terms before sharing them.', 'يمكنني التحقق مما إذا كان هناك عرض حالي متعلق بهذه الخدمة. وسأتأكد من تفاصيله وشروطه قبل مشاركتها معك.', 'Verify current offers and terms before discussing them.', 'تحقق من العروض الحالية وشروطها قبل مناقشتها.' FROM services s WHERE s.name_en = 'Sculptra'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Sculptra' ORDER BY id LIMIT 1) AND step_order = 5);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 6, 'Center selection', 'اختيار المركز', 'Which location would be most convenient for you? I can check the information available for that center.', 'أي موقع يناسبك أكثر؟ يمكنني التحقق من المعلومات المتاحة لذلك المركز.', 'Confirm the preferred location before checking the next steps.', 'تأكد من الموقع المفضل قبل التحقق من الخطوات التالية.' FROM services s WHERE s.name_en = 'Sculptra'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Sculptra' ORDER BY id LIMIT 1) AND step_order = 6);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 7, 'Booking prompt', 'الخطوة التالية', 'Would you like help arranging a consultation or checking appointment availability for Sculptra?', 'هل ترغب في المساعدة على ترتيب استشارة أو التحقق من المواعيد المتاحة لخدمة سكولبترا؟', 'Confirm the caller’s preference and recap the next step before ending the call.', 'تأكد مما يفضله المتصل ولخّص الخطوة التالية قبل إنهاء المكالمة.' FROM services s WHERE s.name_en = 'Sculptra'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Sculptra' ORDER BY id LIMIT 1) AND step_order = 7);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 1, 'Opening', 'الترحيب', 'Thank you for asking about Dermapen. What would you most like to know about the treatment?', 'شكراً لاستفسارك عن ديرمابن. ما أكثر ما تود معرفته عن العلاج؟', 'Welcome the caller warmly and let them explain what they would like to know.', 'رحّب بالمتصل بود واترك له المجال لشرح ما يود معرفته.' FROM services s WHERE s.name_en = 'Dermapen'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Dermapen' ORDER BY id LIMIT 1) AND step_order = 1);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 2, 'Qualification', 'أسئلة التأهيل', 'What would you like to address regarding skin texture and microneedling? Have you discussed this with a qualified practitioner before?', 'ما الذي تود الاستفسار عنه بخصوص ملمس البشرة والإبر الدقيقة؟ وهل سبق لك مناقشة ذلك مع مختص مؤهل؟', 'Ask open questions about the caller’s goals; do not assess treatment suitability.', 'اطرح أسئلة مفتوحة حول أهداف المتصل، ولا تحدد مدى ملاءمة العلاج.' FROM services s WHERE s.name_en = 'Dermapen'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Dermapen' ORDER BY id LIMIT 1) AND step_order = 2);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 3, 'Key points', 'النقاط الأساسية', 'I can share general information about Dermapen and what a consultation may cover. A qualified practitioner can discuss your individual needs.', 'يمكنني مشاركة معلومات عامة عن ديرمابن وما قد تتضمنه الاستشارة. ويمكن لمختص مؤهل مناقشة احتياجاتك الفردية.', 'Keep information general and refer individual or clinical questions to a qualified practitioner.', 'قدّم معلومات عامة وأحِل الأسئلة الطبية أو الفردية إلى مختص مؤهل.' FROM services s WHERE s.name_en = 'Dermapen'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Dermapen' ORDER BY id LIMIT 1) AND step_order = 3);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 4, 'Objection handling', 'التعامل مع الاعتراض', 'It is understandable to have questions before deciding. What is your main concern? I can share general information or help arrange a consultation.', 'من الطبيعي أن تكون لديك أسئلة قبل اتخاذ القرار. ما هو استفسارك الأساسي؟ يمكنني مشاركة معلومات عامة أو المساعدة في ترتيب استشارة.', 'Acknowledge concerns without guarantees or pressure, and offer an appropriate next step.', 'قدّر مخاوف المتصل دون ضمانات أو ضغط، واقترح خطوة تالية مناسبة.' FROM services s WHERE s.name_en = 'Dermapen'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Dermapen' ORDER BY id LIMIT 1) AND step_order = 4);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 5, 'Offer guidance', 'تقديم العرض', 'I can check whether there is a current offer related to this service. I will confirm its details and terms before sharing them.', 'يمكنني التحقق مما إذا كان هناك عرض حالي متعلق بهذه الخدمة. وسأتأكد من تفاصيله وشروطه قبل مشاركتها معك.', 'Verify current offers and terms before discussing them.', 'تحقق من العروض الحالية وشروطها قبل مناقشتها.' FROM services s WHERE s.name_en = 'Dermapen'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Dermapen' ORDER BY id LIMIT 1) AND step_order = 5);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 6, 'Center selection', 'اختيار المركز', 'Which location would be most convenient for you? I can check the information available for that center.', 'أي موقع يناسبك أكثر؟ يمكنني التحقق من المعلومات المتاحة لذلك المركز.', 'Confirm the preferred location before checking the next steps.', 'تأكد من الموقع المفضل قبل التحقق من الخطوات التالية.' FROM services s WHERE s.name_en = 'Dermapen'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Dermapen' ORDER BY id LIMIT 1) AND step_order = 6);

INSERT INTO call_flow_steps (service_id, branch_id, step_order, label_en, label_ar, content_en, content_ar, tip_en, tip_ar)
SELECT s.id, NULL::INTEGER, 7, 'Booking prompt', 'الخطوة التالية', 'Would you like help arranging a consultation or checking appointment availability for Dermapen?', 'هل ترغب في المساعدة على ترتيب استشارة أو التحقق من المواعيد المتاحة لخدمة ديرمابن؟', 'Confirm the caller’s preference and recap the next step before ending the call.', 'تأكد مما يفضله المتصل ولخّص الخطوة التالية قبل إنهاء المكالمة.' FROM services s WHERE s.name_en = 'Dermapen'
AND NOT EXISTS (SELECT 1 FROM call_flow_steps WHERE service_id = (SELECT id FROM services WHERE name_en = 'Dermapen' ORDER BY id LIMIT 1) AND step_order = 7);

INSERT INTO quick_replies (branch_id, category, title_en, title_ar, body_en, body_ar, tags)
SELECT NULL::INTEGER, 'Booking', 'Checking appointment availability', NULL, 'I would be happy to help you find a suitable appointment. Which day or time works best for you?', 'يسعدني مساعدتك في العثور على موعد مناسب. ما اليوم أو الوقت الذي يناسبك؟', ARRAY['appointment', 'availability', 'booking']::TEXT[]
WHERE NOT EXISTS (SELECT 1 FROM quick_replies WHERE branch_id IS NULL AND category = 'Booking' AND title_en = 'Checking appointment availability');

INSERT INTO quick_replies (branch_id, category, title_en, title_ar, body_en, body_ar, tags)
SELECT NULL::INTEGER, 'Booking', 'Confirming appointment details', NULL, 'Your appointment request for [service] on [date] at [time] has been noted. I will confirm the available details with you shortly.', 'تم تسجيل طلب موعدك لخدمة [الخدمة] بتاريخ [التاريخ] الساعة [الوقت]. سأؤكد لك التفاصيل المتاحة قريباً.', ARRAY['appointment', 'confirmation', 'booking']::TEXT[]
WHERE NOT EXISTS (SELECT 1 FROM quick_replies WHERE branch_id IS NULL AND category = 'Booking' AND title_en = 'Confirming appointment details');

INSERT INTO quick_replies (branch_id, category, title_en, title_ar, body_en, body_ar, tags)
SELECT NULL::INTEGER, 'Pricing', 'Sharing a price estimate', NULL, 'The listed starting price for [service] is [amount]. The final price may depend on your requirements, which can be discussed during a consultation.', 'السعر المبدئي المدرج لخدمة [الخدمة] هو [المبلغ]. قد يعتمد السعر النهائي على احتياجاتك، ويمكن مناقشتها خلال الاستشارة.', ARRAY['price', 'estimate', 'consultation']::TEXT[]
WHERE NOT EXISTS (SELECT 1 FROM quick_replies WHERE branch_id IS NULL AND category = 'Pricing' AND title_en = 'Sharing a price estimate');

INSERT INTO quick_replies (branch_id, category, title_en, title_ar, body_en, body_ar, tags)
SELECT NULL::INTEGER, 'Pricing', 'Explaining a consultation', NULL, 'A consultation is a helpful way to discuss your goals and get information relevant to you. Would you like me to help arrange one?', 'تساعدك الاستشارة على مناقشة أهدافك والحصول على معلومات تناسب احتياجاتك. هل ترغب أن أساعدك في ترتيبها؟', ARRAY['price', 'consultation', 'information']::TEXT[]
WHERE NOT EXISTS (SELECT 1 FROM quick_replies WHERE branch_id IS NULL AND category = 'Pricing' AND title_en = 'Explaining a consultation');

INSERT INTO quick_replies (branch_id, category, title_en, title_ar, body_en, body_ar, tags)
SELECT NULL::INTEGER, 'Complaints', 'Acknowledging a concern', NULL, 'I am sorry to hear that this has been frustrating. I would like to understand what happened so I can direct your concern to the right team.', 'يؤسفني أن هذه التجربة سببت لك الإزعاج. أود فهم ما حدث حتى أتمكن من توجيه ملاحظتك إلى الفريق المناسب.', ARRAY['concern', 'support', 'follow-up']::TEXT[]
WHERE NOT EXISTS (SELECT 1 FROM quick_replies WHERE branch_id IS NULL AND category = 'Complaints' AND title_en = 'Acknowledging a concern');

INSERT INTO quick_replies (branch_id, category, title_en, title_ar, body_en, body_ar, tags)
SELECT NULL::INTEGER, 'Complaints', 'Setting a follow-up expectation', NULL, 'Thank you for bringing this to our attention. I have noted the details and will share them with the appropriate team for follow-up.', 'شكراً لإبلاغنا بهذا الأمر. سجلت التفاصيل وسأشاركها مع الفريق المعني للمتابعة.', ARRAY['concern', 'follow-up', 'support']::TEXT[]
WHERE NOT EXISTS (SELECT 1 FROM quick_replies WHERE branch_id IS NULL AND category = 'Complaints' AND title_en = 'Setting a follow-up expectation');

INSERT INTO quick_replies (branch_id, category, title_en, title_ar, body_en, body_ar, tags)
SELECT NULL::INTEGER, 'Promotions', 'Checking an available promotion', NULL, 'I can help check which promotions are currently available for [service] at your preferred branch. Which branch would you like to visit?', 'يمكنني التحقق من العروض المتاحة حالياً لخدمة [الخدمة] في الفرع الذي تفضله. أي فرع ترغب في زيارته؟', ARRAY['promotion', 'offer', 'branch']::TEXT[]
WHERE NOT EXISTS (SELECT 1 FROM quick_replies WHERE branch_id IS NULL AND category = 'Promotions' AND title_en = 'Checking an available promotion');

INSERT INTO quick_replies (branch_id, category, title_en, title_ar, body_en, body_ar, tags)
SELECT NULL::INTEGER, 'Promotions', 'Clarifying promotion details', NULL, 'Promotion details can vary by offer and branch. Let me check the current terms for [promotion] so I can share accurate information.', 'قد تختلف تفاصيل العرض حسب العرض والفرع. دعني أتحقق من الشروط الحالية لـ[العرض] لأشاركك معلومات دقيقة.', ARRAY['promotion', 'offer', 'details']::TEXT[]
WHERE NOT EXISTS (SELECT 1 FROM quick_replies WHERE branch_id IS NULL AND category = 'Promotions' AND title_en = 'Clarifying promotion details');

INSERT INTO offers (branch_id, title_en, title_ar, description_en, description_ar, valid_until, is_active)
SELECT b.id, 'Welcome Refresh', 'انتعاش الترحيب', 'New customers receive 15% off their first service.', 'يحصل العملاء الجدد على خصم 15٪ على خدمتهم الأولى.', CURRENT_DATE + 30, true
FROM branches b WHERE b.name_en = 'Handsome & Pretty Abu Dhabi'
AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.branch_id = b.id AND o.title_en = 'Welcome Refresh');

INSERT INTO offers (branch_id, title_en, title_ar, description_en, description_ar, valid_until, is_active)
SELECT b.id, 'Glow Together', 'إشراقة معاً', 'Book two beauty services and save 20% on the second service.', 'احجز خدمتين تجميليتين واحصل على خصم 20٪ على الخدمة الثانية.', CURRENT_DATE + 30, true
FROM branches b WHERE b.name_en = 'Handsome & Pretty Abu Dhabi'
AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.branch_id = b.id AND o.title_en = 'Glow Together');

INSERT INTO offers (branch_id, title_en, title_ar, description_en, description_ar, valid_until, is_active)
SELECT b.id, 'Welcome Refresh', 'انتعاش الترحيب', 'New customers receive 15% off their first service.', 'يحصل العملاء الجدد على خصم 15٪ على خدمتهم الأولى.', CURRENT_DATE + 30, true
FROM branches b WHERE b.name_en = 'Tres Jolie Fujairah'
AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.branch_id = b.id AND o.title_en = 'Welcome Refresh');

INSERT INTO offers (branch_id, title_en, title_ar, description_en, description_ar, valid_until, is_active)
SELECT b.id, 'Glow Together', 'إشراقة معاً', 'Book two beauty services and save 20% on the second service.', 'احجز خدمتين تجميليتين واحصل على خصم 20٪ على الخدمة الثانية.', CURRENT_DATE + 30, true
FROM branches b WHERE b.name_en = 'Tres Jolie Fujairah'
AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.branch_id = b.id AND o.title_en = 'Glow Together');

INSERT INTO prices (service_id, branch_id, price, currency)
SELECT s.id, b.id, 0.00, 'AED' FROM services s CROSS JOIN branches b
WHERE s.name_en = 'Laser Hair Removal' AND b.name_en = 'Handsome & Pretty Abu Dhabi'
AND NOT EXISTS (SELECT 1 FROM prices p WHERE p.service_id = s.id AND p.branch_id = b.id);

INSERT INTO prices (service_id, branch_id, price, currency)
SELECT s.id, b.id, 0.00, 'AED' FROM services s CROSS JOIN branches b
WHERE s.name_en = 'Laser Hair Removal' AND b.name_en = 'Tres Jolie Fujairah'
AND NOT EXISTS (SELECT 1 FROM prices p WHERE p.service_id = s.id AND p.branch_id = b.id);

INSERT INTO prices (service_id, branch_id, price, currency)
SELECT s.id, b.id, 0.00, 'AED' FROM services s CROSS JOIN branches b
WHERE s.name_en = 'Botox' AND b.name_en = 'Handsome & Pretty Abu Dhabi'
AND NOT EXISTS (SELECT 1 FROM prices p WHERE p.service_id = s.id AND p.branch_id = b.id);

INSERT INTO prices (service_id, branch_id, price, currency)
SELECT s.id, b.id, 0.00, 'AED' FROM services s CROSS JOIN branches b
WHERE s.name_en = 'Botox' AND b.name_en = 'Tres Jolie Fujairah'
AND NOT EXISTS (SELECT 1 FROM prices p WHERE p.service_id = s.id AND p.branch_id = b.id);

INSERT INTO prices (service_id, branch_id, price, currency)
SELECT s.id, b.id, 0.00, 'AED' FROM services s CROSS JOIN branches b
WHERE s.name_en = 'Hydrafacial' AND b.name_en = 'Handsome & Pretty Abu Dhabi'
AND NOT EXISTS (SELECT 1 FROM prices p WHERE p.service_id = s.id AND p.branch_id = b.id);

INSERT INTO prices (service_id, branch_id, price, currency)
SELECT s.id, b.id, 0.00, 'AED' FROM services s CROSS JOIN branches b
WHERE s.name_en = 'Hydrafacial' AND b.name_en = 'Tres Jolie Fujairah'
AND NOT EXISTS (SELECT 1 FROM prices p WHERE p.service_id = s.id AND p.branch_id = b.id);

INSERT INTO prices (service_id, branch_id, price, currency)
SELECT s.id, b.id, 0.00, 'AED' FROM services s CROSS JOIN branches b
WHERE s.name_en = 'Sculptra' AND b.name_en = 'Handsome & Pretty Abu Dhabi'
AND NOT EXISTS (SELECT 1 FROM prices p WHERE p.service_id = s.id AND p.branch_id = b.id);

INSERT INTO prices (service_id, branch_id, price, currency)
SELECT s.id, b.id, 0.00, 'AED' FROM services s CROSS JOIN branches b
WHERE s.name_en = 'Sculptra' AND b.name_en = 'Tres Jolie Fujairah'
AND NOT EXISTS (SELECT 1 FROM prices p WHERE p.service_id = s.id AND p.branch_id = b.id);

INSERT INTO prices (service_id, branch_id, price, currency)
SELECT s.id, b.id, 0.00, 'AED' FROM services s CROSS JOIN branches b
WHERE s.name_en = 'Dermapen' AND b.name_en = 'Handsome & Pretty Abu Dhabi'
AND NOT EXISTS (SELECT 1 FROM prices p WHERE p.service_id = s.id AND p.branch_id = b.id);

INSERT INTO prices (service_id, branch_id, price, currency)
SELECT s.id, b.id, 0.00, 'AED' FROM services s CROSS JOIN branches b
WHERE s.name_en = 'Dermapen' AND b.name_en = 'Tres Jolie Fujairah'
AND NOT EXISTS (SELECT 1 FROM prices p WHERE p.service_id = s.id AND p.branch_id = b.id);
