export const gpt_query = (brain, input, history, template) => {
  let query;

  if (brain.toLowerCase() === 'run') {
    query = `Document objective, subjective, assessment and include differential diagnosis, plan and include suggested testing, instruction letter to patient. Split the physical exam to vital signs Including BMI and organs examined individually: ${input}`;
  } else {
    query = `${brain} : ${input}.`;
  }

  return query;
};

// let filter = ` resposne should be in html formay based on the data provided ans should only be in html format, also make sure the data is related to medical field and if there is an error it should highlight it only html format. if there is some query where you are not able to answer just return in html tag you were not able to find the answer.`;
// filter += `Reponse generated should not have extra instructions. for user to read such as \`\`\` Please replace the placeholder text with your actual data and error messages `;
// filter += `there should be no text color style applied to response.`
// filter += 'there should be no similar content in response \`\`\` The final HTML file when rendered would provide a neatly organized clinical management plan. However, this information should be used as a guideline and does not substitute for professional medical advice. '
// filter += 'there should be no table in response.'
// filter += 'remove if any "As an AI" type of response'
