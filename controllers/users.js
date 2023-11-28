const {request, response} = require('express');
const usersModel = require('../models/users');
const pool = require('../db');

const Characterslist = async (req=request, res = response) =>{
    let conn;
    try {
         conn = await pool.getConnection();

         const users = await conn.query(usersModel.getAll, (err) => {
            if (err) {
                throw new Error(err);
            }
         }) 

         res.json(users);
    } catch (error){
        res.status(500).json(error);

    }finally {
        if (conn) conn.end();
    } 
}

const listCharacterByID = async (req=request, res = response) =>{
    const {id} = req.params;
 
    if (isNaN(id)) {
        res.status(400).json({msg: 'Invalid ID'});
        return;
    }

    let conn;
    try {
         conn = await pool.getConnection();

         const [user] = await conn.query(usersModel.getByID, [id], (err) => {
            if (err) {
                throw new Error(err);
            }
         }) 

         if (!user) {
            res.status(404).json({msg: 'User not found'});
            return;
         }

         res.json(user);
    } catch (error){
        res.status(500).json(error);

    }finally {
        if (conn) conn.end();
    } 
}

const addCharacter = async (req = request, res = response) => {
    const{
        Team,
        Position,
        Games_Played, 
        Win,
        Draw,
        Loss,
        Goals_For,
        Goals_Against,
        Goal_Difference,
        Points
    } = req.body;

    if (!Team || !Position || !Games_Played || !Win || !Draw || !Loss || !Goals_For || !Goals_Against || !Goal_Difference || !Points ) {
        res.status(400).json({msg: 'Missing information'});
        return;
    }

    const character = [Team, Position, Games_Played, Win,Draw,Loss,Goals_For,Goals_Against,Goal_Difference,Points];

    let conn;

    try {
        conn = await pool.getConnection();

        const [usernameUser] = await conn.query(usersModel.getByUsername, [Team], (error) => {
            if (err) throw err;
        });

        if (usernameUser) {
            res.status(409).json({msg: `User with character ${Team} already exists`});
            return;
        }

        const userAdded = await conn.query(usersModel.addRow, [...character], (err) => {
            if (err) throw err;
        })
        
        
        if (userAdded.affectedRows === 0) throw new Error({msg: 'Failed to add user'});

        res.json({msg: 'User added succesfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    } finally {
        if (conn) conn.end();
    }

}


const updateCharacter = async (req = request, res = response) => {

    const{
        Team,
        Position, 
        Games_Played,
        Win,
        Draw,
        Loss,
        Goals_For,
        Goals_Against,
        Goal_Difference,
        Points
    } = req.body;
    const {id} = req.params;

  
    let newUserData = [
        Team,
        Position, 
        Games_Played,
        Win,
        Draw,
        Loss,
        Goals_For,
        Goals_Against,
        Goal_Difference,
        Points

    ];
  
    let conn;

    try {
        conn = await pool.getConnection();

        
        const [userExists] = await conn.query (
            usersModel.getByID, [id], (err) => {if (err) throw err;}
        );

        if (!userExists) {
            res.status(404).json({msg: 'User not found'});
            return
        }
        const [usernameUser] = await conn.query(usersModel.getByUsername, [Team], (error) => {
            if (err) throw err;
        });

        if (usernameUser) {
            res.status(409).json({msg: `User with username ${Team} already exists`});
            return;
        }

        const oldUserData = [
            userExists.Team,
            userExists.Position,
            userExists.Games_Played,
            userExists.Win,
            userExists.Draw,
            userExists.Loss,
            userExists.Goals_For,
            userExists.Goals_Against,
            userExists.Goal_Difference,
            userExists.Points
        ];

        newUserData.forEach((userData, index) => {
            if (!userData) {
                newUserData[index] = oldUserData[index];
            }
        });
    

        const userUpdated = await conn.query(usersModel.updateRow, [...newUserData, id], (err) => {
            if (err) throw err;
        });
        
        
        if (userUpdated.affectedRows === 0) throw new Error({msg: 'User not updated'});

        res.json({msg: 'User updated succesfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    } finally {
        if (conn) conn.end();
    }
}


const  deleteCharacter = async (req = request, res = response) => {
    let conn;

    try {
        conn = await pool.getConnection();
        const {id} = req.params;

        const [userExists] = await conn.query (
            usersModel.getByID, [id], (err) => {if (err) throw err;}
        );

        if (!userExists) {
            res.status(404).json({msg: 'User not found'});
            return;
        }

        const userDeleted = await conn.query (
            usersModel.deleteRow, [id], (err) => {if (err) throw err;}
        );

        if (userDeleted.affectedRows === 0) {
            throw new Error({msg: 'Failed to delete user'})
        };

        res.json({msg: 'User delete succesfully'});
        }catch (error) {
            console.log(error);
            res.status(500).json(error);
        } finally {
            if (conn) conn.end();
        }
    }



module.exports = {Characterslist, listCharacterByID, addCharacter, updateCharacter, deleteCharacter};