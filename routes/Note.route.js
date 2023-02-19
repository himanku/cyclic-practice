const express=require("express")
const {NoteModel}=require("../models/Note.model")
const noteRouter=express.Router()

/**
* @swagger
* components:
*   schemas:
*       Note:
*           type: object
*           properties:
*               id:
*                   type: string
*                   description: The auto-generated id of the note
*               title:
*                   type: string
*                   description: The note title
*               note:
*                   type: string
*                   description: The note body
*               category:
*                   type: string
*                   description: Category of the note
*               userID:
*                   type: string
*                   description: The User ID who created the note
*/

/**
 * @swagger
 * tags:
 *    name: Notes
 *    description: All the API routes related to the Notes
 */

/**
* @swagger
* /notes:
*   get:
*       summary: This will get all the notes created by the logged-in user
*       tags: [Notes]
*       responses:
*               200:
*                   description: The list of all the notes
*                   content:
*                       application/json:
*                           schema:
*                               type: array
*                               item:
*                                   $ref: "#/components/schemas/Note"
*
*/
noteRouter.get("/",async (req,res)=>{
    const userID = req.body.userID;
    try{
        const notes=await NoteModel.find({ userID: userID })
        res.send(notes)
    }catch(err){
        console.log(err)
        res.send({"msg":"Something went wrong", "error": err.message})
    }
})

/**
* @swagger
* /notes/create:
*   post:
*       summary: To create a new note
*       tags: [Notes]
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/Note'
*   responses:
*       200:
*           description: The note is successfully created
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/Note'
*       500:
*           description: Some server error
*/

noteRouter.post("/create",async (req,res)=>{
    const payload=req.body
    try{
        const new_note=new NoteModel(payload)
        await new_note.save()
        res.send({"msg":"New Note Created"})
    }catch(err){
        console.log(err)
        res.send({"msg":"Something went wrong"})
    }

})

/**
* @swagger
* /notes/update/{id}:
*   patch:
*       summary: It will update the note details
*       tags: [Notes]
*       parameters:
*           - in: path
*             name: id
*             schema:
*               type: string
*             required: true
*             description: The note id
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/Note'
*       responses:
*           200:
*               description: The Note Details has been updated
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Note'
*           404:
*               description: The Note was not found
*           500:
*               description: Some error happened
*/


noteRouter.patch("/update/:id",async (req,res)=>{
    const payload=req.body 
    const id=req.params.id 
    const note=await NoteModel.findOne({"_id":id})
    const userID_in_note=note.userID
    const userID_making_req=req.body.userID
    try{
        if(userID_making_req!==userID_in_note){
            res.send({"msg":"You are not authorized"})
        } else {
            await NoteModel.findByIdAndUpdate({"_id":id},payload)
            res.send("Updated the note")
        }
        
    }catch(err){
        console.log(err)
        res.send({"msg":"Something went wrong"})
    }
})

/**
* @swagger
* /notes/delete/{id}:
*   delete:
*       summary: Remove the note by id
*       tags: [Notes]
*       parameters:
*           - in: path
*             name: id
*             schema:
*             type: string
*             required: true
*             description: The note id
*
*       responses:
*           200:
*               description: The note is deleted
*           404:
*               description: The note was not found
*/

noteRouter.delete("/delete/:id",async (req,res)=>{
    const id=req.params.id 
    const note=await NoteModel.findOne({"_id":id})
    const userID_in_note=note.userID
    const userID_making_req=req.body.userID
    try{
        if(userID_making_req!==userID_in_note){
            res.send({"msg":"You are not authorized"})
        } else {
            await NoteModel.findByIdAndDelete({"_id":id})
            res.send("Deleted the note")
        }
        
    }catch(err){
        console.log(err)
        res.send({"msg":"Something went wrong"})
    }
})

module.exports={
    noteRouter
}
