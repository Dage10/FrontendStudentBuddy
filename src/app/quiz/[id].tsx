import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { TAB_BAR_SPACE } from '@/constants/layout';
import { useSession } from '@/lib/session';
import { getQuiz, answerQuestion, errorMessage, type Question } from '@/lib/api';
import { CheckIcon, XIcon } from '@/components/quiz-icons';

export default function QuizScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { token } = useSession();
    const [ questions, setQuestions ] = useState<Question[]>([]);
    const [ currentIndex, setCurrentIndex ] = useState(0);
    const [ isFinished, setIsFinished ] = useState(false);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState<string>();

    useEffect(() => {
        async function loadQuiz() {
            try {
                const data = await getQuiz(token!, id);
                setQuestions(data);
            } catch (e) {
                setError(errorMessage(e));
            } finally {
                setLoading(false);
            }
        }
        if (token && id) {
            loadQuiz();
        }
    }, [id, token]);

    if (loading) {
        return (
            <Screen>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#4F4645"/>
                    <Text style={styles.text}>Loading quiz...</Text>
                </View>
            </Screen>
        )
    }

    if (questions.length === 0) {
        return (
            <Screen>
                <View style={styles.center}>
                    <Text style={styles.error}>{error || 'No questions available.'}</Text>
                    <Button title="Back to Study" onPress={() => router.replace('/study')} />
                </View>
            </Screen>
        )
    }

    if (isFinished) {
        const correctCount = questions.filter(q => q.is_correct).length;
        return (
            <Screen>
                <ScrollView contentContainerStyle={styles.content}>
                    <Card>
                        <Text style={styles.title}>Result: {correctCount}/{questions.length}</Text>

                        <View style={styles.resultsList}>
                            {questions.map((q, idx) => (
                                <View key={q.id} style={styles.resultItem}>
                                    <View style={styles.resultHeader}>
                                        {q.is_correct ? <CheckIcon /> : <XIcon />}
                                        <Text style={styles.resultQuestionText}>
                                            {idx + 1}. {q.question}
                                        </Text>
                                    </View>
                                {!q.is_correct && (
                                    <View style={styles.resultDetails}>
                                        <Text style={styles.errorTextDetail}>Your answer: {q.user_answer || 'None'}</Text>
                                        <Text style={styles.successTextDetail}>Correct answer: {q.correct_answer}</Text>
                                    </View>
                                )}
                                </View>
                            ))}
                        </View>

                        <View style={styles.actionButtons}>
                            <Button title="Return to study" onPress={() => router.replace('/study')} />
                            <Button title="Go to history" onPress={() => router.replace('/history')} />
                        </View>
                    </Card>
                </ScrollView>
            </Screen>
        );
    }

    const currentQuestion = questions[currentIndex];
    const totalQuestions = questions.length;

    async function handleSelect(option: string) {
        if(currentQuestion.user_answer) return;

        try {
            setError(undefined);
            const result = await answerQuestion(token!, id, currentQuestion.id, option);

            setQuestions(prev =>
                prev.map(q => (q.id === currentQuestion.id ? {...q, user_answer: option, is_correct: result.isCorrect, correct_answer: result.correctAnswer } : q))
            );
        } catch (e) {
            setError(errorMessage(e));
        }
    }

    function handleNext() {
        if (currentIndex < totalQuestions - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    }

    function handlePrevious() {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    }

    return (
        <Screen>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                <Card>
                    <Text style={styles.counter}>Question {currentIndex + 1} of {totalQuestions}</Text>
                    <Text style={styles.title}>{currentQuestion.question}</Text>

                    <View style={styles.optionsContainer}>
                        {currentQuestion.options.map((option, idx) => {
                            const isSelected = currentQuestion.user_answer === option;
                            return (
                                <Pressable
                                    key={idx}
                                    disabled={!!currentQuestion.user_answer}
                                    style={[styles.optionButton, isSelected && styles.optionSelected]}
                                    onPress={() => handleSelect(option)}
                                >
                                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                                        {option}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>

                    {currentQuestion.user_answer && (
                        <Text style={[styles.feedback, currentQuestion.is_correct ? styles.successText : styles.errorText]}>
                            {currentQuestion.is_correct ? 'Correct!' : 'Incorrect.'}
                        </Text>
                    )}

                    {error && <Text style={styles.error}>{error}</Text>}
                    <View style={styles.navRow}>
                        {currentIndex > 0 ? (
                            <Button title="Previous" onPress={handlePrevious}/>
                        ) : (
                            <View />
                        )}
                        <Button
                            title={currentIndex === totalQuestions - 1 ? 'Finish' : 'Next'}
                            onPress={handleNext}
                        />

                    </View>
                </Card>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    content: { padding: 24, paddingBottom: TAB_BAR_SPACE, gap: 16 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
    counter: { fontSize: 14, fontWeight: '600', color: '#475569' },
    title: { fontSize: 24, fontWeight: '600', color: '#0F172A', marginBottom: 8, lineHeight: 30 },
    optionsContainer: { gap: 12, marginVertical: 8},
    optionButton: {
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderWidth: 1,
        borderColor: '#64748B',
        borderRadius: 16,
        padding: 14,
    },
    optionSelected: {
        backgroundColor: '#EEF2FF',
        borderWidth: 2,
        borderColor: '#4F46E5',
    },
    optionText: { fontSize: 16, color: '#0F172A', lineHeight: 22 },
    optionTextSelected: { fontWeight: '600', color: '#475569' },
    navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", marginTop: 16 },
    error: { color: '#B91C1C', fontSize: 14, textAlign: 'center' },
    errorText: { color: '#B91C1C', fontWeight: '600', marginTop: 8 },
    successText: { color: '#15803D', fontWeight: '600', marginTop: 8 },
    feedback: { fontSize: 14},
    text: { fontSize: 16, color: '#0F172A' },
    resultsList: { gap: 12, marginVertical: 12 },
    resultItem: { gap: 4, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: 'rgba(100,116,139,0.15)' },
    resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    resultQuestionText: { fontSize: 15, fontWeight: '500', color: '#0F172A', flex: 1 },
    resultDetails: { paddingLeft: 28, gap: 2 },
    errorTextDetail: { fontSize: 13, color: '#B91C1C' },
    successTextDetail: { fontSize: 13, color: '#15803D', fontWeight: '500' },
    actionButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, gap: 12 },

})

