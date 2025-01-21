import { sql } from '@vercel/postgres';
// import {
//   CustomerField,
//   CustomersTableType,
//   InvoiceForm,
//   InvoicesTable,
//   LatestInvoiceRaw,
//   Revenue,
// } from './definitions';
// import { formatCurrency } from './utils';

import { Answer, Choice, Question, QuestionRaw, Quiz, QuizRaw } from "./definitions";

// export async function fetchQuizData

// export async function fetchRevenue() {
//   try {
//     // Artificially delay a response for demo purposes.
//     // Don't do this in production :)

//     // console.log('Fetching revenue data...');
//     // await new Promise((resolve) => setTimeout(resolve, 3000));

//     const data = await sql<Revenue>`SELECT * FROM revenue`;

//     // console.log('Data fetch completed after 3 seconds.');

//     return data.rows;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch revenue data.');
//   }
// }

// export async function fetchLatestInvoices() {
//   try {
//     const data = await sql<LatestInvoiceRaw>`
//       SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
//       FROM invoices
//       JOIN customers ON invoices.customer_id = customers.id
//       ORDER BY invoices.date DESC
//       LIMIT 5`;

//     const latestInvoices = data.rows.map((invoice) => ({
//       ...invoice,
//       amount: formatCurrency(invoice.amount),
//     }));
//     return latestInvoices;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch the latest invoices.');
//   }
// }

export async function fetchQuizNamesAndIdsForUser(user_id: string) {
  try {
    const rawQuizzes = await sql<QuizRaw>
      `SELECT q.* FROM quizzes q JOIN users u ON q.id = u.assignedquiz WHERE u.id = ${user_id}`
    // const rawQuestions = await sql

    const quizzes = rawQuizzes.rows.map((quiz) => ({
      ...quiz,
      questions: undefined
    }))
    return quizzes;
  }
  catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchQuizData(quiz_id: string) {
  try {
    const rawQuizzes = await sql<QuizRaw>
      `SELECT * FROM quizzes WHERE id = ${quiz_id}`
    // const rawQuestions = await sql

    const rawQuiz = rawQuizzes.rows[0]

    const rawQuestions = await sql<QuestionRaw>
      `SELECT * FROM questions WHERE id = ANY(SELECT unnest(questions) FROM quizzes WHERE id = ${quiz_id})`

    const questions: Question[] = [];
    for (let quesI = 0; quesI < rawQuestions.rows.length; quesI++) { 
      const ques = rawQuestions.rows[quesI]
      if (ques.choices) {
        const arrayString = ques.choices.join(",")

        //I could not for the life of me get this IN query statement to work. It works fine when I run it in Neon
        //I know this method is not efficient, but I have it in here just to get it working
        //console.log(`SELECT * FROM choices WHERE id IN('${ques.choices.join("', '")}')`)
        // const choiceArray = await sql<Choice>
        // `SELECT * FROM choices WHERE id = ANY(ARRAY[${arrayString}]::varchar[])`
          let choiceArray:Choice[]=[]
          for(let choiceI=0; choiceI<ques.choices.length;choiceI++){
            const choiceQuery = await sql<Choice>
             `SELECT * FROM choices WHERE id = ${ques.choices[choiceI]}`
             choiceArray.push(choiceQuery.rows[0])
          }


        const correctChoices = choiceArray.filter((choice) => { if (ques.correct_choices?.includes(choice.id)) { return choice } })
        questions.push({ ...ques, choices: choiceArray, correct_choices: correctChoices })
      } else {
        questions.push({ ...ques, choices: undefined, correct_choices: undefined })
      }

    }

    const quiz: Quiz = {
      ...rawQuiz,
      questions: questions
    }

    return quiz;
  }
  catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch quiz data.');
  }
}

export async function fetchAnswersForUser(user_id: string, quiz_id: string) {
  try {
    const rawAnswers = await sql<Answer>
      `SELECT * FROM student_answers WHERE user_id = ${user_id} AND quiz_id = ${quiz_id}`

    const answers = rawAnswers.rows.map((answer) => ({
      ...answer,
    }))
    return answers;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch answers.');
  }
}

export async function submitAnswerData(user_id: string, question_id: string, quiz_id: string, answer_text: string) {
  await sql`INSERT INTO student_answers (id, user_id, quiz_id, question_id, answer_text) 
  VALUES (gen_random_uuid(), ${user_id}, ${quiz_id}, ${question_id}, ${answer_text})`
}

export async function syncAnswerData(user_id: string, quiz_id: string, questionsToAnswers: Map<string, string>) {
  console.log("synching")
  //const builtString = Array.from(questionsToAnswers.entries()).map(([key, value]) => {return `(gen_random_uuid(), '${user_id}', '${key}',  '${quiz_id}', '${value}')`}).join(',');
  // console.log(builtString)
  //await sql `INSERT INTO student_answers (id, user_id, quiz_id, question_id, answer_text) 
  //VALUES ${builtString};`
  questionsToAnswers.entries().forEach(([key, value]) => { submitAnswerData(user_id, key, quiz_id, value) })
  //submitAnswerData(user_id, quiz_id, )
}

export async function clearAnswersForQuiz(user_id: string, quiz_id: string) {
  console.log("clearing")
  await sql`DELETE FROM student_answers WHERE user_id = ${user_id} AND quiz_id = ${quiz_id}`
}

// export async function fetchCardData() {
//   try {
//     // You can probably combine these into a single SQL query
//     // However, we are intentionally splitting them to demonstrate
//     // how to initialize multiple queries in parallel with JS.
//     const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
//     const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
//     const invoiceStatusPromise = sql`SELECT
//          SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
//          SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
//          FROM invoices`;

//     const data = await Promise.all([
//       invoiceCountPromise,
//       customerCountPromise,
//       invoiceStatusPromise,
//     ]);

//     const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
//     const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
//     const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
//     const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

//     return {
//       numberOfCustomers,
//       numberOfInvoices,
//       totalPaidInvoices,
//       totalPendingInvoices,
//     };
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch card data.');
//   }
// }

// const ITEMS_PER_PAGE = 6;
// export async function fetchFilteredInvoices(
//   query: string,
//   currentPage: number,
// ) {
//   const offset = (currentPage - 1) * ITEMS_PER_PAGE;

//   try {
//     const invoices = await sql<InvoicesTable>`
//       SELECT
//         invoices.id,
//         invoices.amount,
//         invoices.date,
//         invoices.status,
//         customers.name,
//         customers.email,
//         customers.image_url
//       FROM invoices
//       JOIN customers ON invoices.customer_id = customers.id
//       WHERE
//         customers.name ILIKE ${`%${query}%`} OR
//         customers.email ILIKE ${`%${query}%`} OR
//         invoices.amount::text ILIKE ${`%${query}%`} OR
//         invoices.date::text ILIKE ${`%${query}%`} OR
//         invoices.status ILIKE ${`%${query}%`}
//       ORDER BY invoices.date DESC
//       LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
//     `;

//     return invoices.rows;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch invoices.');
//   }
// }

// export async function fetchInvoicesPages(query: string) {
//   try {
//     const count = await sql`SELECT COUNT(*)
//     FROM invoices
//     JOIN customers ON invoices.customer_id = customers.id
//     WHERE
//       customers.name ILIKE ${`%${query}%`} OR
//       customers.email ILIKE ${`%${query}%`} OR
//       invoices.amount::text ILIKE ${`%${query}%`} OR
//       invoices.date::text ILIKE ${`%${query}%`} OR
//       invoices.status ILIKE ${`%${query}%`}
//   `;

//     const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
//     return totalPages;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch total number of invoices.');
//   }
// }

// export async function fetchInvoiceById(id: string) {
//   try {
//     const data = await sql<InvoiceForm>`
//       SELECT
//         invoices.id,
//         invoices.customer_id,
//         invoices.amount,
//         invoices.status
//       FROM invoices
//       WHERE invoices.id = ${id};
//     `;

//     const invoice = data.rows.map((invoice) => ({
//       ...invoice,
//       // Convert amount from cents to dollars
//       amount: invoice.amount / 100,
//     }));

//     return invoice[0];
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch invoice.');
//   }
// }

// export async function fetchCustomers() {
//   try {
//     const data = await sql<CustomerField>`
//       SELECT
//         id,
//         name
//       FROM customers
//       ORDER BY name ASC
//     `;

//     const customers = data.rows;
//     return customers;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch all customers.');
//   }
// }

// export async function fetchFilteredCustomers(query: string) {
//   try {
//     const data = await sql<CustomersTableType>`
// 		SELECT
// 		  customers.id,
// 		  customers.name,
// 		  customers.email,
// 		  customers.image_url,
// 		  COUNT(invoices.id) AS total_invoices,
// 		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
// 		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
// 		FROM customers
// 		LEFT JOIN invoices ON customers.id = invoices.customer_id
// 		WHERE
// 		  customers.name ILIKE ${`%${query}%`} OR
//         customers.email ILIKE ${`%${query}%`}
// 		GROUP BY customers.id, customers.name, customers.email, customers.image_url
// 		ORDER BY customers.name ASC
// 	  `;

//     const customers = data.rows.map((customer) => ({
//       ...customer,
//       total_pending: formatCurrency(customer.total_pending),
//       total_paid: formatCurrency(customer.total_paid),
//     }));

//     return customers;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch customer table.');
//   }
// }
