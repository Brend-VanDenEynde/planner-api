const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const userController = require('../controllers/userController');

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Haal alle gebruikers op
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Aantal gebruikers per pagina
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Aantal gebruikers over te slaan (voor paginering)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Zoek in firstname, lastname en email
 *         example: jan
 *     responses:
 *       200:
 *         description: Lijst van alle gebruikers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     limit:
 *                       type: integer
 *                       description: Aantal items per pagina
 *                     offset:
 *                       type: integer
 *                       description: Aantal items overgeslagen
 *                     total:
 *                       type: integer
 *                       description: Totaal aantal gebruikers
 */
router.get('/users', userController.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Haal specifieke gebruiker op
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Gebruiker ID
 *     responses:
 *       200:
 *         description: Gebruiker gevonden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Gebruiker niet gevonden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/users/:id', userController.getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Maak nieuwe gebruiker aan
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: Jan
 *                 description: Mag geen cijfers bevatten
 *               lastname:
 *                 type: string
 *                 example: Janssen
 *                 description: Mag geen cijfers bevatten
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jan.janssen@example.com
 *                 description: Geldig email formaat vereist
 *     responses:
 *       201:
 *         description: Gebruiker succesvol aangemaakt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Ongeldige invoer of email bestaat al
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/users', userController.createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update gebruiker
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Gebruiker ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: Mag geen cijfers bevatten
 *               lastname:
 *                 type: string
 *                 description: Mag geen cijfers bevatten
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Geldig email formaat vereist
 *     responses:
 *       200:
 *         description: Gebruiker succesvol geüpdatet
 *       404:
 *         description: Gebruiker niet gevonden
 *       400:
 *         description: Email bestaat al of ongeldige invoer
 */
router.put('/users/:id', userController.updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Verwijder gebruiker
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Gebruiker ID
 *     responses:
 *       200:
 *         description: Gebruiker succesvol verwijderd
 *       404:
 *         description: Gebruiker niet gevonden
 */
router.delete('/users/:id', userController.deleteUser);

/**
 * @swagger
 * /api/users/{id}/tasks:
 *   get:
 *     summary: Haal alle taken van een gebruiker op
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Gebruiker ID
 *     responses:
 *       200:
 *         description: Gebruiker met bijbehorende taken
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *       404:
 *         description: Gebruiker niet gevonden
 */
router.get('/users/:id/tasks', userController.getUserTasks);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Haal alle taken op
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Aantal taken per pagina
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Aantal taken over te slaan (voor paginering)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Zoek in title en description
 *         example: backend
 *     responses:
 *       200:
 *         description: Lijst van alle taken
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     limit:
 *                       type: integer
 *                       description: Aantal items per pagina
 *                     offset:
 *                       type: integer
 *                       description: Aantal items overgeslagen
 *                     total:
 *                       type: integer
 *                       description: Totaal aantal taken
 */
router.get('/tasks', taskController.getAllTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Haal specifieke taak op
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Taak ID
 *     responses:
 *       200:
 *         description: Taak gevonden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       404:
 *         description: Taak niet gevonden
 */
router.get('/tasks/:id', taskController.getTaskById);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Maak nieuwe taak aan
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - user_id
 *               - due_date
 *             properties:
 *               title:
 *                 type: string
 *                 example: Backend API ontwikkelen
 *               description:
 *                 type: string
 *                 example: REST API bouwen met Express en SQLite
 *               status:
 *                 type: string
 *                 enum: [open, in_progress, done]
 *                 example: open
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               due_date:
 *                 type: string
 *                 format: date
 *                 example: 2026-01-15
 *                 description: Deadline (moet in de toekomst liggen)
 *     responses:
 *       201:
 *         description: Taak succesvol aangemaakt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Ongeldige invoer of due_date ligt in het verleden
 */
router.post('/tasks', taskController.createTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update taak
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Taak ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [open, in_progress, done]
 *               due_date:
 *                 type: string
 *                 format: date
 *                 description: Deadline (moet in de toekomst liggen)
 *     responses:
 *       200:
 *         description: Taak succesvol geüpdatet
 *       404:
 *         description: Taak niet gevonden
 *       400:
 *         description: Due_date ligt in het verleden
 */
router.put('/tasks/:id', taskController.updateTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Verwijder taak
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Taak ID
 *     responses:
 *       200:
 *         description: Taak succesvol verwijderd
 *       404:
 *         description: Taak niet gevonden
 */
router.delete('/tasks/:id', taskController.deleteTask);

module.exports = router;
