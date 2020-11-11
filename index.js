    const express = require("express");
    const Joi = require("joi");

    const app = express();

    app.use(express.json());

    const mentors = [{
        id  :   1,
        name:   "Mrigank",
        company:    "Visa",
        avabilityHour : 10,
        mentee : [1]
    },{
        id  :   2,
        name:   "Harshad",
        company:    "SAP",
        avabilityHour : 10,
        mentee : []
    },{
        id  :   2,
        name:   "Rathi",
        company:    "Jio",
        avabilityHour : 10,
        mentee : []
    }]

    const mentees = [{
        id  :   1,
        name:   "Babuji",
    },{
        id  :   2,
        name:   "Pankaj",
    },{
        id  :   3,
        name:   "Munna",
    }];

    const scheudle = [{
        mentorId: 1,
        menteeId: 1,
        duration : 1,
    }]

    const url = "/api/v1";

    // API for particular mentor
    app.get(url+"/mentors/:id", (req, res) => {
        const id = req.params.id;
        const mentor = mentors.find(mentor => mentor.id === parseInt(id));
        
        if(!mentor){
            res.status(404).send('Mentor with id : ${id} was not found');
            return;
        }
        res.send(mentor);
    })

    //API for All mentor
    app.get(url+"/mentors", (req, res) => {
        
        if(mentors.length === 0){
            res.status(200).send('Mentor not listed');
            return;
        }
        res.send(mentors);
    })

    // API for particular mentee
    app.get(url+"/mentee/:id", (req, res) => {
        const id = req.params.id;
        const mentee = mentees.find(mentee => mentee.id === parseInt(id));
        
        if(!mentee){
            res.status(404).send('Mentee with id : ${id} was not found');
            return;
        }
        res.send(mentee);
    })

    //API for All mentor
    app.get(url+"/mentee", (req, res) => {
        
        if(mentees.length === 0){
            res.status(200).send('Mentee not listed');
            return;
        }
        res.send(mentees);
    })

    //API to add of mentor
    app.post(url + '/mentor', (req, res) => {

        const schema = Joi.object({
            name: Joi.string().min(1).required(),
            company: Joi.string().min(1).required(),
            avabilityHour: Joi.required()
        });
        const validationObject = schema.validate(req.body);

        if (validationObject.error) {
            res.status(400).send(validationObject.error.details[0].message);
            return;
        }

        const mentor = {
            ...req.body, id: mentors.length + 1
        };

        mentors.push(mentor);

        res.send(mentors);
    })


    //API to add of mentee
    app.post(url + '/mentee', (req, res) => {

        const schema = Joi.object({
            name: Joi.string().min(1).required()
        });
        const validationObject = schema.validate(req.body);

        if (validationObject.error) {
            res.status(400).send(validationObject.error.details[0].message);
            return;
        }

        const mentee = {
            ...req.body, id: mentees.length + 1
        };

        mentees.push(mentee);

        res.send(mentees);
    })

    //API for assigning mentee to mentor
    app.put(url + "/assign", (req, res) => {

        const mentorName = req.body.mentor;
        const mentor = mentors.find((mentor) => mentor.name === mentorName );
        const menteeName = req.body.mentee;
        const mentee = mentees.find(mentee => mentee.name === menteeName);
        if(!(mentor.id && mentee.id)){
            res.status(404).send('Mentee or Mentor not found');
            return;
        }

        mentors[mentor.id - 1].mentee.push(mentee.id);
        res.send(mentors);
    })
    const sessions = [];
    //API for Schedule a session
    app.put(url + "/session", (req, res) => {

        const schema = Joi.object({
            mentor: Joi.string().min(1).required(),
            mentee: Joi.string().min(1).required(),
            duration: Joi.required()
        });
        const validationObject = schema.validate(req.body);

        if (validationObject.error) {
            res.status(400).send(validationObject.error.details[0].message);
            return;
        }

        const mentorName = req.body.mentor;
        const mentor = mentors.find((mentor) => mentor.name === mentorName );
        const menteeName = req.body.mentee;
        const mentee = mentees.find(mentee => mentee.name === menteeName);
        if(!(mentor.id && mentee.id)){
            res.status(404).send('Mentee or Mentor not found');
            return;
        }
        const _session = {
            id : sessions.length + 1, 
            mentorId : mentor.id,
            mentorName : mentorName,
            menteeId : mentee.id,
            menteeName : menteeName,
            duration : req.body.duration
        }
        sessions.push(_session);
        res.send(sessions);
    })

    // API for particular session
    app.get(url+"/session/:id", (req, res) => {
        const id = req.params.id;
        const _session = sessions.find(session => session.id === parseInt(id));
        
        if(!_session){
            res.status(404).send('Session with id : ${id} was not found');
            return;
        }
        res.send(_session);
    })

    //API for All mentor
    app.get(url+"/sessions", (req, res) => {
        
        if(sessions.length === 0){
            res.status(200).send('Sesssions not scheudel yet');
            return;
        }
        res.send(sessions);
    })

    app.listen(3000, () => console.log('Listening'));