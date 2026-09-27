import CopyButton from './CopyButton';

function QuestionCard({ question, questionIndex, language = 'english' }) {
  const ar = language === 'arabic';
  return (
    <article className="question-card" id={`question-${questionIndex}`}>
      <div className="question-row"><span className="question-label">{ar ? 'السؤال' : 'Question'}</span><strong>{ar ? question.questionAr : question.questionEn}</strong></div>
      <div className="answer-grid">
        <div className="answer-block"><span className="answer-label">English answer</span><p>{question.answerEn}</p><CopyButton text={question.answerEn} label="Copy English" /></div>
        <div className="answer-block arabic-copy" dir="rtl"><span className="answer-label">الإجابة بالعربية</span><p>{question.answerAr}</p><CopyButton text={question.answerAr} label="Copy Arabic" /></div>
      </div>
    </article>
  );
}

export default QuestionCard;
