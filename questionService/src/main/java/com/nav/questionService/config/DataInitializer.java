package com.nav.questionService.config;

import com.nav.questionService.entity.Question;
import com.nav.questionService.repository.QuestionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initQuestions(QuestionRepository questionRepository) {
        return args -> {
            if (questionRepository.count() > 0) {
                System.out.println("⚠️ Database already contains " + questionRepository.count() + " questions. Skipping initialization.");
                return;
            }

            System.out.println("📚 Initializing sample question data...");

            // Java Questions
            Question q1 = new Question();
            q1.setQuestionTitle("What is the size of int variable in Java?");
            q1.setOption1("8 bits");
            q1.setOption2("16 bits");
            q1.setOption3("32 bits");
            q1.setOption4("64 bits");
            q1.setRightAnswer("32 bits");
            q1.setDifficultyLevel("Easy");
            q1.setCategory("Java");

            Question q2 = new Question();
            q2.setQuestionTitle("Which keyword is used for inheritance in Java?");
            q2.setOption1("implements");
            q2.setOption2("extends");
            q2.setOption3("inherits");
            q2.setOption4("super");
            q2.setRightAnswer("extends");
            q2.setDifficultyLevel("Easy");
            q2.setCategory("Java");

            Question q3 = new Question();
            q3.setQuestionTitle("What is the parent class of all classes in Java?");
            q3.setOption1("Object");
            q3.setOption2("Class");
            q3.setOption3("Parent");
            q3.setOption4("Super");
            q3.setRightAnswer("Object");
            q3.setDifficultyLevel("Easy");
            q3.setCategory("Java");

            Question q4 = new Question();
            q4.setQuestionTitle("Which of these is not an access modifier in Java?");
            q4.setOption1("public");
            q4.setOption2("protected");
            q4.setOption3("private");
            q4.setOption4("packaged");
            q4.setRightAnswer("packaged");
            q4.setDifficultyLevel("Easy");
            q4.setCategory("Java");

            Question q5 = new Question();
            q5.setQuestionTitle("What is the output of 10 + 20 + \"30\" in Java?");
            q5.setOption1("102030");
            q5.setOption2("3030");
            q5.setOption3("60");
            q5.setOption4("Error");
            q5.setRightAnswer("3030");
            q5.setDifficultyLevel("Medium");
            q5.setCategory("Java");

            // Python Questions
            Question q6 = new Question();
            q6.setQuestionTitle("Which of the following is used to define a function in Python?");
            q6.setOption1("function");
            q6.setOption2("def");
            q6.setOption3("func");
            q6.setOption4("define");
            q6.setRightAnswer("def");
            q6.setDifficultyLevel("Easy");
            q6.setCategory("Python");

            Question q7 = new Question();
            q7.setQuestionTitle("What is the correct file extension for Python files?");
            q7.setOption1(".python");
            q7.setOption2(".pt");
            q7.setOption3(".py");
            q7.setOption4(".pyt");
            q7.setRightAnswer(".py");
            q7.setDifficultyLevel("Easy");
            q7.setCategory("Python");

            Question q8 = new Question();
            q8.setQuestionTitle("Which of the following is a mutable data type in Python?");
            q8.setOption1("tuple");
            q8.setOption2("string");
            q8.setOption3("list");
            q8.setOption4("int");
            q8.setRightAnswer("list");
            q8.setDifficultyLevel("Easy");
            q8.setCategory("Python");

            Question q9 = new Question();
            q9.setQuestionTitle("What will be the output of print(type([]))  in Python?");
            q9.setOption1("<class 'tuple'>");
            q9.setOption2("<class 'list'>");
            q9.setOption3("<class 'array'>");
            q9.setOption4("<class 'dict'>");
            q9.setRightAnswer("<class 'list'>");
            q9.setDifficultyLevel("Easy");
            q9.setCategory("Python");

            Question q10 = new Question();
            q10.setQuestionTitle("How do you start a comment in Python?");
            q10.setOption1("//");
            q10.setOption2("/*");
            q10.setOption3("#");
            q10.setOption4("--");
            q10.setRightAnswer("#");
            q10.setDifficultyLevel("Easy");
            q10.setCategory("Python");

            // JavaScript Questions
            Question q11 = new Question();
            q11.setQuestionTitle("Which company developed JavaScript?");
            q11.setOption1("Microsoft");
            q11.setOption2("Netscape");
            q11.setOption3("Oracle");
            q11.setOption4("Google");
            q11.setRightAnswer("Netscape");
            q11.setDifficultyLevel("Easy");
            q11.setCategory("JavaScript");

            Question q12 = new Question();
            q12.setQuestionTitle("Which symbol is used for comments in JavaScript?");
            q12.setOption1("//");
            q12.setOption2("#");
            q12.setOption3("/* */");
            q12.setOption4("Both // and /* */");
            q12.setRightAnswer("Both // and /* */");
            q12.setDifficultyLevel("Easy");
            q12.setCategory("JavaScript");

            Question q13 = new Question();
            q13.setQuestionTitle("What is the correct syntax for referring to an external script?");
            q13.setOption1("<script href=\"xxx.js\">");
            q13.setOption2("<script name=\"xxx.js\">");
            q13.setOption3("<script src=\"xxx.js\">");
            q13.setOption4("<script file=\"xxx.js\">");
            q13.setRightAnswer("<script src=\"xxx.js\">");
            q13.setDifficultyLevel("Easy");
            q13.setCategory("JavaScript");

            Question q14 = new Question();
            q14.setQuestionTitle("How do you declare a variable in JavaScript?");
            q14.setOption1("var myVar;");
            q14.setOption2("variable myVar;");
            q14.setOption3("v myVar;");
            q14.setOption4("declare myVar;");
            q14.setRightAnswer("var myVar;");
            q14.setDifficultyLevel("Easy");
            q14.setCategory("JavaScript");

            Question q15 = new Question();
            q15.setQuestionTitle("Which method is used to parse a string to an integer in JavaScript?");
            q15.setOption1("parseInt()");
            q15.setOption2("parseInteger()");
            q15.setOption3("toInt()");
            q15.setOption4("convertToInt()");
            q15.setRightAnswer("parseInt()");
            q15.setDifficultyLevel("Medium");
            q15.setCategory("JavaScript");

            // Database Questions
            Question q16 = new Question();
            q16.setQuestionTitle("What does SQL stand for?");
            q16.setOption1("Structured Query Language");
            q16.setOption2("Strong Question Language");
            q16.setOption3("Structured Question Language");
            q16.setOption4("Strong Query Language");
            q16.setRightAnswer("Structured Query Language");
            q16.setDifficultyLevel("Easy");
            q16.setCategory("Database");

            Question q17 = new Question();
            q17.setQuestionTitle("Which SQL statement is used to extract data from a database?");
            q17.setOption1("OPEN");
            q17.setOption2("GET");
            q17.setOption3("EXTRACT");
            q17.setOption4("SELECT");
            q17.setRightAnswer("SELECT");
            q17.setDifficultyLevel("Easy");
            q17.setCategory("Database");

            Question q18 = new Question();
            q18.setQuestionTitle("Which SQL keyword is used to sort the result-set?");
            q18.setOption1("SORT");
            q18.setOption2("ORDER BY");
            q18.setOption3("SORT BY");
            q18.setOption4("ORDER");
            q18.setRightAnswer("ORDER BY");
            q18.setDifficultyLevel("Easy");
            q18.setCategory("Database");

            Question q19 = new Question();
            q19.setQuestionTitle("Which SQL statement is used to update data in a database?");
            q19.setOption1("SAVE");
            q19.setOption2("MODIFY");
            q19.setOption3("UPDATE");
            q19.setOption4("SAVE AS");
            q19.setRightAnswer("UPDATE");
            q19.setDifficultyLevel("Easy");
            q19.setCategory("Database");

            Question q20 = new Question();
            q20.setQuestionTitle("Which SQL statement is used to delete data from a database?");
            q20.setOption1("REMOVE");
            q20.setOption2("DELETE");
            q20.setOption3("COLLAPSE");
            q20.setOption4("DESTROY");
            q20.setRightAnswer("DELETE");
            q20.setDifficultyLevel("Easy");
            q20.setCategory("Database");

            questionRepository.saveAll(Arrays.asList(
                    q1, q2, q3, q4, q5, q6, q7, q8, q9, q10,
                    q11, q12, q13, q14, q15, q16, q17, q18, q19, q20
            ));

            System.out.println("✅ Sample questions initialized successfully!");
            System.out.println("📊 Total questions: " + questionRepository.count());
        };
    }
}
