// services/service.js
// const db = require("../prisma/db");

const prisma = require("../prisma/db");
console.log(Object.keys(prisma));

// async function fetchAllQuestions() {
//   const query = `
//     SELECT *
//     FROM asa.asa_question_mst
//     ORDER BY q_id ASC
//   `;
//   const result = await db.query(query);
//   return result.rows;
// }

async function fetchAllQuestions() {
  return prisma.asa_question_mst.findMany({
    orderBy: { q_id: "asc" },
  });
}

// async function fetchQuestionById(qId) {
//   const query = `
//     SELECT *
//     FROM asa.asa_question_mst
//     WHERE q_id = $1
//     LIMIT 1
//   `;
//   const result = await db.query(query, [qId]);
//   return result.rows[0] || null;
// }

async function fetchQuestionById(qId) {
  return prisma.asa_question_mst.findUnique({
    where: { q_id: qId },
  });
}

// async function fetchControlsByQuestionId(qId) {
//   const query = `
//     select control_id, c.q_id, q.q_desc, c.control_type_id, gv.type_value, c.control_description
//     from asa.asa_control_mst c
//     join asa.asa_question_mst q on c.q_id=q.q_id
//     join asa.asa_general_value_mst gv on c.control_type_id=gv.type_id
//     WHERE c.q_id = $1
//   `;
//   const result = await db.query(query, [qId]);
//   return result.rows[0] || null;
// }

async function fetchControlsByQuestionId(qId) {
  const rows = await prisma.asa_control_mst.findMany({
    where: { q_id: qId },
    include: {
      asa_question_mst: true,
    },
    orderBy: { control_id: "asc" },
  });

  if (!rows || rows.length === 0) {
    // return {
    //   q_id: qId,
    //   q_desc: '',
    //   options: [],
    // };
    return null;
  }

  const { q_id, q_desc, q_map } = rows[0].asa_question_mst || {
    q_id: qId,
    q_desc: "",
    q_map: "",
  };

  const options = rows.map((r) => ({
    control_type_id: r.control_type_id ?? null,
    control_description: r.control_description ?? "",
  }));

  return {
    q_id,
    q_desc: q_desc ?? "",
    q_map: q_map ?? "",
    options,
  };
}

async function fetchQuestionControlMapping(applicationId) {
  const rows = await prisma.asa_question_control_mapping.findMany({
    where: { application_id: applicationId },
    include: {
      asa_application_mst: true,
      asa_question_mst: true,
      asa_control_mst: true,
    },
    orderBy: { id: "asc" },
  });

  if (!rows || rows.length === 0) {
    return null;
  }

  const { application_id, application_no, applicant_name } = rows[0]
    .asa_application_mst || {
    application_id: applicationId,
    application_no: "",
    applicant_name: "",
  };

  const { q_id, q_desc, q_map } = rows.map((r) => ({
    q_id: r.qId ?? null,
    q_desc: "",
    q_map: "",
  }));

  const options = rows.map((r) => ({
    control_type_id: r.control_type_id ?? null,
    control_description: r.control_description ?? "",
  }));

  return {
    application_id,
    application_no: application_no ?? "",
    applicant_name: applicant_name ?? "",
    q_id,
    q_desc: q_desc ?? "",
    q_map: q_map ?? "",
    options,
  };
}

module.exports = {
  fetchAllQuestions,
  fetchQuestionById,
  fetchControlsByQuestionId,
  fetchQuestionControlMapping,
};
