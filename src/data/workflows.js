// DEPRECATED — data now served from API. Safe to remove after testing.
const branchPrompt = {
  en: 'Which center would be most convenient for you: Handsome & Pretty in Abu Dhabi, Tres Jolie in Fujairah, or Body Slim in Abu Dhabi?',
  ar: 'أي مركز أنسب لك: هاندسم آند بريتي في أبوظبي، تريز جولي في الفجيرة، أم بودي سليم في أبوظبي؟',
};

const workflows = {
  'laser-hair-removal': {
    opening: { en: 'I would be happy to explain how laser hair removal works and help you choose the right next step.', ar: 'يسعدني أن أوضح لك طريقة عمل إزالة الشعر بالليزر وأساعدك في اختيار الخطوة التالية المناسبة.' },
    qualificationQuestions: { en: ['Which area would you like to treat?', 'Have you waxed or plucked recently?', 'Have you had significant sun exposure or tanning recently?'], ar: ['ما المنطقة التي ترغبين في علاجها؟', 'هل استخدمتِ الشمع أو النتف مؤخراً؟', 'هل تعرضتِ للشمس أو التسمير مؤخراً؟'] },
    keyPoints: { en: ['Hair reduction is progressive and usually needs a course of sessions.', 'Shaving is preferred between sessions; waxing and plucking should be avoided.', 'A consultation confirms the safest settings for the skin and hair.'], ar: ['يحدث تقليل الشعر تدريجياً وغالباً يحتاج إلى عدة جلسات.', 'يفضل استخدام الحلاقة بين الجلسات وتجنب الشمع والنتف.', 'تحدد الاستشارة الإعدادات الأنسب والأكثر أماناً للبشرة والشعر.'] },
    objection: { en: 'If the patient is worried about discomfort: explain that most people feel brief warmth or small pinches and that cooling and settings can be adjusted.', ar: 'إذا كان المريض قلقاً من الألم، اشرح أن معظم الأشخاص يشعرون بدفء سريع أو وخز بسيط، ويمكن تعديل التبريد والإعدادات.' },
    offer: { en: 'After confirming the area and suitability, check the current offer and explain any eligible first-visit or package saving.', ar: 'بعد تأكيد المنطقة والملاءمة، تحقق من العرض الحالي واشرح أي خصم متاح للزيارة الأولى أو الباقات.' },
  },
  botox: {
    opening: { en: 'I can help you understand Botox treatment, expected timing, and what a practitioner will assess.', ar: 'يمكنني مساعدتك في فهم علاج البوتوكس والمدة المتوقعة وما سيقيّمه المختص.' },
    qualificationQuestions: { en: ['Which expression lines would you like to discuss?', 'Have you had Botox or another injectable treatment before?', 'Are you pregnant, breastfeeding, or taking any relevant medication?'], ar: ['ما الخطوط التعبيرية التي ترغبين في مناقشتها؟', 'هل أجريتِ البوتوكس أو علاجاً قابلاً للحقن من قبل؟', 'هل أنتِ حامل أو مرضعة أو تتناولين أدوية مهمة؟'] },
    keyPoints: { en: ['A qualified practitioner selects the dose and treatment points.', 'Results develop over several days and are reviewed around two weeks.', 'Results are temporary and commonly last around three to four months.'], ar: ['يحدد المختص المؤهل الجرعة ونقاط العلاج.', 'تظهر النتائج خلال عدة أيام ويتم تقييمها عادة بعد أسبوعين.', 'النتائج مؤقتة وتستمر عادةً من ثلاثة إلى أربعة أشهر.'] },
    objection: { en: 'If the patient fears a frozen look: explain that the goal is to soften lines while preserving appropriate facial expression.', ar: 'إذا خاف المريض من مظهر جامد، اشرح أن الهدف هو تخفيف الخطوط مع الحفاظ على تعابير الوجه الطبيعية.' },
    offer: { en: 'Present any active offer only after the practitioner has confirmed the appropriate treatment area and plan.', ar: 'اعرض أي عرض حالي بعد أن يؤكد المختص منطقة العلاج والخطة المناسبة.' },
  },
  hydrafacial: {
    opening: { en: 'I can explain the Hydrafacial steps and help you decide whether it matches your skin goals.', ar: 'يمكنني شرح خطوات الهيدرافيشل ومساعدتك في معرفة مدى مناسبته لأهداف بشرتك.' },
    qualificationQuestions: { en: ['What would you most like to improve: dryness, dullness, or congestion?', 'Is your skin currently irritated or being treated for an active condition?', 'Do you have an event or preferred date in mind?'], ar: ['ما أكثر ما ترغبين في تحسينه: الجفاف أم البهتان أم الشوائب؟', 'هل بشرتك متهيجة حالياً أو تخضع لعلاج لحالة نشطة؟', 'هل لديك مناسبة أو موعد مفضل؟'] },
    keyPoints: { en: ['The treatment combines cleansing, exfoliation, extraction, and hydration.', 'The protocol can be adjusted for many skin types.', 'Most patients return to normal activities immediately.'], ar: ['يجمع العلاج بين التنظيف والتقشير والاستخراج والترطيب.', 'يمكن تعديل البروتوكول ليناسب أنواعاً عديدة من البشرة.', 'يعود معظم المرضى إلى أنشطتهم مباشرة.'] },
    objection: { en: 'If the patient expects a medical cure: clarify that it refreshes and hydrates skin, while persistent conditions need professional assessment.', ar: 'إذا توقع المريض علاجاً لحالة طبية، وضح أنه ينعش ويرطب البشرة، بينما تحتاج الحالات المستمرة إلى تقييم متخصص.' },
    offer: { en: 'Offer the current facial promotion when the patient confirms their preferred treatment and timing.', ar: 'اعرض عرض العناية بالبشرة الحالي بعد تأكيد العلاج والموعد المناسبين.' },
  },
  sculptra: {
    opening: { en: 'I can explain how Sculptra supports gradual collagen improvement and what to expect from consultation.', ar: 'يمكنني شرح كيفية دعم سكولبترا لتحفيز الكولاجين تدريجياً وما يمكن توقعه في الاستشارة.' },
    qualificationQuestions: { en: ['What change would you like to see in volume or firmness?', 'Have you had injectable treatments before?', 'Do you have any medical conditions, allergies, or upcoming events?'], ar: ['ما التغيير الذي ترغبين في رؤيته في الامتلاء أو التماسك؟', 'هل أجريتِ علاجات قابلة للحقن من قبل؟', 'هل لديك حالة صحية أو حساسية أو مناسبة قريبة؟'] },
    keyPoints: { en: ['Sculptra is gradual rather than an immediate volume treatment.', 'A practitioner decides whether a course of sessions is appropriate.', 'Following massage and aftercare instructions is important.'], ar: ['نتائج سكولبترا تدريجية وليست علاجاً فورياً للامتلاء.', 'يحدد المختص مدى مناسبة سلسلة من الجلسات.', 'من المهم اتباع تعليمات التدليك والعناية بعد العلاج.'] },
    objection: { en: 'If the patient expects instant results: explain the collagen-building timeline and arrange a consultation for an individual plan.', ar: 'إذا توقع المريض نتائج فورية، اشرح المدة اللازمة لتحفيز الكولاجين وحدد استشارة لخطة فردية.' },
    offer: { en: 'Discuss any active offer only after the practitioner confirms suitability and the recommended plan.', ar: 'ناقش أي عرض حالي بعد تأكيد المختص للملاءمة والخطة المقترحة.' },
  },
  dermapen: {
    opening: { en: 'I can explain how Dermapen supports skin renewal and help you prepare for a consultation.', ar: 'يمكنني شرح كيفية دعم ديرمابن لتجدد البشرة ومساعدتك في الاستعداد للاستشارة.' },
    qualificationQuestions: { en: ['Are you mainly concerned about texture, pores, fine lines, or acne scars?', 'Do you currently have active acne, irritation, or an infection?', 'Have you used strong skincare products or had a recent procedure?'], ar: ['هل القلق الأساسي هو الملمس أم المسام أم الخطوط الدقيقة أم ندبات حب الشباب؟', 'هل لديك حب شباب نشط أو تهيج أو التهاب حالياً؟', 'هل استخدمتِ منتجات قوية أو أجريتِ إجراءً حديثاً؟'] },
    keyPoints: { en: ['Fine sterile needles create controlled micro-channels to support renewal.', 'A course may be recommended for texture or scar concerns.', 'Gentle aftercare and sun protection are important during recovery.'], ar: ['تنشئ الإبر الدقيقة المعقمة قنوات مضبوطة لدعم تجدد البشرة.', 'قد يوصى بسلسلة جلسات لتحسين الملمس أو الندبات.', 'العناية اللطيفة وواقي الشمس مهمان أثناء التعافي.'] },
    objection: { en: 'If the patient is worried about redness: explain that temporary redness is common and the practitioner will advise on expected recovery.', ar: 'إذا كان المريض قلقاً من الاحمرار، اشرح أن الاحمرار المؤقت شائع وسيقدم المختص إرشادات حول التعافي المتوقع.' },
    offer: { en: 'Once the concern and suitability are clear, share any active skin-treatment offer and its conditions.', ar: 'بعد تحديد المشكلة والملاءمة، شارك عرض علاج البشرة الحالي وشروطه.' },
  },
};

export const getWorkflowByServiceId = (serviceId) => workflows[serviceId];
export const workflowBranchPrompt = branchPrompt;
