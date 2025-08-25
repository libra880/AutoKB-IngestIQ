function validate(parsed) {
  const requiredFields = [
    'Case ID',
    'Product',
    'Customer Type',
    'Severity',
    'Escalation Status',
    'Issue Description',
    'Troubleshooting Steps',
    'Resolution',
    'Tags'
  ];

  const issues = [];

  requiredFields.forEach(field => {
    const value = parsed[field];
    if (!value || (Array.isArray(value) && value.length === 0)) {
      issues.push(`${field} is missing or empty.`);
    }
    if (typeof value === 'string' && value.startsWith('>')) {
      issues.push(`${field} still contains placeholder text.`);
    }
  });

  return issues;
}

module.exports = validate;