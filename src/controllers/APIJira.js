const axios = require('axios');
const APIJiraAsses = async (req, res, next) => {
  try {
    console.log('-------Body', req.body);
    var effort = 0;

    if(Number(req.body.total_effort_approved) !== 0){
      effort = req.body.total_effort_approved;
    } else {
      effort = req.body.total_effort
    }
    console.log("Effort-----------",effort)
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
        customfield_10208: Number(effort),
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
    return res.json({ message: 'Hubo un error en la solicitud al actualizar el Jira. Verifique si el Código Jira existe' });
  }

}

const APIJiraExec = async (req, res, next) => {
  try {
    console.log('-------Body', req.body);
    var effort = 0;

    if(Number(req. body.total_effort_approved) !== 0){
      effort = req.body.total_effort_approved;
    } else {
      effort = req.body.total_effort
    }
    console.log("Effort-----------",effort)
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
        customfield_10209: Number(effort),
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
    return res.json({ message: 'Hubo un error en la solicitud al actualizar el Jira. Verifique si el Código Jira existe' });
  }

}

module.exports = {
  APIJiraAsses,
  APIJiraExec
};
