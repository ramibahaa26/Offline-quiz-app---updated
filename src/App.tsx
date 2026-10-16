import React from 'react';
import { QuizProvider, useQuiz } from './context/QuizContext.tsx';
import { WelcomeRoleScreen } from './components/WelcomeRoleScreen.tsx';
import { TeacherWorkspace } from './components/TeacherWorkspace.tsx';
import { StudentWorkspace } from './components/StudentWorkspace.tsx';

const AppContent: React.FC = () => {
  const { currentRole } = useQuiz();

  return (
    <div className="min-h-screen font-sans selection:bg-[#E8DEF8] selection:text-[#21005D]">
      {currentRole === 'CHOOSE_ROLE' && <WelcomeRoleScreen />}
      {currentRole === 'TEACHER' && <TeacherWorkspace />}
      {currentRole === 'STUDENT' && <StudentWorkspace />}
    </div>
  );
};

export default function App() {
  return (
    <QuizProvider>
      <AppContent />
    </QuizProvider>
  );
}
