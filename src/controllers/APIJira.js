const axios = require('axios');
const APIJiraAsses = async (req, res, next) => {
  try {
    //console.log('-------Body', req.body);

    //const url = 'https://salamancasolutions.atlassian.net/rest/api/3/issue/SSI-123';
    const url = 'https://salamancasolutions.atlassian.net/rest/api/3/issue/' + req.body.project_code;
    var username = process.env.JIRA_USER;
    var password = process.env.JIRA_TOKEN;

    const headers = {
      'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64'),
      'Content-Type': 'application/json',
      'Cookie': 'atlassian.xsrf.token=4f7065835b1e8e9327c3f542dfdd29880bf792e5_lin'
    };

    const requestData = {
      fields: {
        customfield_10208: Number(req.body.total_effort),
        //customfield_10209: null
      }
    };

    const response = await axios.put(url, requestData, { headers });

    //return res.status(response.status).json({ response: response.data, message: 'Jira actualizado correctamente' });
    //res.status(response.status);
    return res.json({
      response: response.status, 
      message: 'Jira actualizado correctamente'
  });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Hubo un error en la solicitud.' });
  }

}

const APIJiraExec = async (req, res, next) => {
  try {
    //console.log('-------Body', req.body);

    //const url = 'https://salamancasolutions.atlassian.net/rest/api/3/issue/SSI-123';
    const url = 'https://salamancasolutions.atlassian.net/rest/api/3/issue/' + req.body.project_code;
    var username = process.env.JIRA_USER;
    var password = process.env.JIRA_TOKEN;

    const headers = {
      'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64'),
      'Content-Type': 'application/json',
      'Cookie': 'atlassian.xsrf.token=4f7065835b1e8e9327c3f542dfdd29880bf792e5_lin'
    };

    const requestData = {
      fields: {
        customfield_10209: Number(req.body.total_effort),
        //customfield_10209: null
      }
    };

    const response = await axios.put(url, requestData, { headers });

    //return res.status(response.status).json({ response: response.data, message: 'Jira actualizado correctamente' });
    //res.status(response.status);
    return res.json({
      response: response.status, 
      message: 'Jira actualizado correctamente'
  });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Hubo un error en la solicitud.' });
  }

}

module.exports = {
  APIJiraAsses,
  APIJiraExec
};
