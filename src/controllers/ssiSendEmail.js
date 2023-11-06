
var nodemailer = require('nodemailer');

const SendEmail = async (req, res, next) => {
    try {
        //console.log('Datos que llegan---', req.body)
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'einar.villarroel@salamancasolutions.com',
                pass: 'esfkkaugvmfriosd'
            }
        });
        // import generateHash from 'random-hash';
        // const hash =  generateHash({ length: 6 });
        var subject = 'Registro en ODO Cotizaciones de: '+ req.body.responsible
        /*var textBody = 'Codigo del Jira (business): ' + req.body.project_code + '\n'+ 
                    'Tipo de proyecto: ' + req.body.project_type + '\n'+
                    'Link del Jira: ' + req.body.link_jira + '\n'+
                    'Total Horas: ' + req.body.total_effort*/
        
            var textBody = `<!DOCTYPE html><html lang="en"> <head> <meta http-equiv="Content-Type" content="text/html charset=UTF-8" /><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /> <meta http-equiv="X-UA-Compatible" content="ie=edge" /> <link rel="preconnect" href="https://fonts.gstatic.com" /><link href="https://fonts.googleapis.com/css2?family=Open+Sans" rel="stylesheet" type="text/css" /><title>Document</title></head>`+
            `<body style="margin: 0px"> <div style="padding: 55px 62px 55px 62px; text-align: center;"> <div style="font-family: 'Open Sans'; font-size: 20px; font-weight: normal; line-height: normal;letter-spacing: normal;color: #2781B8;">Registro de Cotización SSI</div><br>`+
            `<div style="font-family: 'Open Sans'; font-size: 16px; font-weight: normal; font-stretch: normal; font-style: normal; line-height: normal; letter-spacing: normal; color: #000000;">`+
            `<p style="margin: 0; padding-bottom: 8px;">Responsable: ${req.body.responsible}</p>`+
            `<p style="margin: 0; padding-bottom: 8px;">Código del Jira (business):${ req.body.project_code} </p>`+
            `<p style="margin: 0; padding-bottom: 8px;">Tipo de proyecto: ${ req.body.project_type }</p>`+
            `<p style="margin: 0; padding-bottom: 8px;">Total Horas Estimadas: ${req.body.total_effort}</p>`+
            `<p style="margin: 0; padding-bottom: 8px;">Total Horas Aprobadas: ${req.body.total_effort_approved}</p></div>`+
            `<a style="font-family: 'Open Sans'; font-size: 17px;font-weight: normal;line-height: normal; letter-spacing: normal; color: #ffffff;text-align: center; background-color:#2781B8;box-sizing: border-box; border-radius: 10px;height:auto; width:250px; display: inline-block; text-decoration: none; padding-bottom: 10px; padding-top: 10px;"`+
            `href="${req.body.link_jira}">JIRA</a></div>`+
            `<div style="text-align: center; padding-top: 30px; padding-bottom: 31px; background: #FAFAFA;"> <div style="font-family: 'Open Sans'; font-size: 16px;font-weight: normal;line-height: normal;letter-spacing: normal; color: #A7A7A7;">Salamanca Solutions International </div> </div></body> </html>`


        var mailOptions = {
            from: 'einar.villarroel@salamancasolutions.com',
            to: 'roxana.machaca@salamancasolutions.com',
            subject: subject,
            html: textBody
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return res.json({
                    message: "Error al enviar el Email",
                    error: error
                });
            } else {
                console.log('Email sent: ' + info.response);
                return res.json({
                    message: "Email enviado correctamente",
                });
            }
        });
    } catch (error) {
        next(error)
    }
}
module.exports = {
    SendEmail
}

/* 
var textBody = '<!DOCTYPE html><html lang="en"><head><meta http-equiv="Content-Type" content="text/html charset=UTF-8" /><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><meta http-equiv="X-UA-Compatible" content="ie=edge" /><link rel="preconnect" href="https://fonts.gstatic.com" /><link href="https://fonts.googleapis.com/css2?family=Open+Sans" rel="stylesheet" type="text/css" /><title>Document</title></head>'+
                        '<body style="margin: 0px"><div style="padding: 55px 62px 55px 62px; text-align: center;"><divstyle="font-family: "Open Sans"; font-size: 20px;font-weight: normal;line-height: normal;letter-spacing: normal;color: #2781B8;">Registro de Cotización SSI</div><br>'+
                '<div style="font-family: "Open Sans"; font-size: 16px; font-weight: normal; font-stretch: normal; font-style: normal; line-height: normal; letter-spacing: normal; color: #000000;">'+
                    '<p style="margin: 0; padding-bottom: 8px;">Responsable: '+req.body.responsible+'</p>'+
                    '<p style="margin: 0; padding-bottom: 8px;">Codigo del Jira (business):' + req.body.project_code + ' </p>'+
                    '<p style="margin: 0; padding-bottom: 8px;">Tipo de proyecto: ' + req.body.project_type + '</p>'+
                    '<p style="margin: 0; padding-bottom: 8px;">Total Horas:' + req.body.total_effort+ '</p></div>'+
                '<a style="font-family: "Open Sans"; font-size: 17px;font-weight: normal;line-height: normal;letter-spacing: normal;color: #ffffff;text-align: center; background-color:#2781B8;box-sizing: border-box; border-radius: 10px;height:auto; width:250px; display: inline-block; text-decoration: none; padding-bottom: 10px; padding-top: 10px;"'+
                    'href="' + req.body.link_jira + '">JIRA</a></div>'+
            '<div style="text-align: center; padding-top: 30px; padding-bottom: 31px; background: #FAFAFA;"> <div style="font-family: "Open Sans"; font-size: 16px;font-weight: normal;line-height: normal;letter-spacing: normal;color: #A7A7A7;">Salamanca Solutions International </div> </div></body> </html>'
 
*/