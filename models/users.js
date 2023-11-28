const usersModel = {
    getAll: `
        SELECT * FROM fifa LIMIT 10`,

    getByID:`SELECT * FROM fifa WHERE id= ?`, 

    addRow: `INSERT INTO fifa (Team, Position, Games_Played, Win, Draw, Loss, Goals_For, Goals_Against, Goal_Difference, Points)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              
    getByUsername: `
    SELECT * FROM fifa WHERE Team = ?`,
    
    updateRow: `UPDATE fifa SET
                 Team = ?,
                 Position = ?,
                 Games_Played = ?,
                 Win = ?,
                 Draw = ?,
                 Loss = ?,
                 Goals_For = ?,
                 Goals_Against =?,
                 Goal_Difference =?,
                 Points = ?
                 WHERE id =?`
                 ,

    deleteRow: `DELETE FROM fifa WHERE id = ?`,

};

module.exports = usersModel;