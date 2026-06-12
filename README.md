# NUGELMA — Sprint 7 Catalogue V1

Ce ZIP contient le premier import massif produits pour Firebase.

## Fichiers

- products_import.json : 35 produits structurés
- importFirebase.js : script d'import Firestore
- package.json : dépendance Firebase

## Important

Le script est configuré pour le projet Firebase :
nugelma-new-version

Par sécurité :
CLEAR_EXISTING_PRODUCTS = false

Cela signifie que l'import ajoute les produits sans supprimer les 3 produits test déjà présents.

## Commandes à lancer dans ce dossier

npm install
npm run import

## Après import

Vérifier dans Firebase > products :
- les nouveaux produits apparaissent
- les champs categorie / univers / prix / stock sont présents

## Note

Les images sont encore provisoires :
- images/category-packaging.jpg
- images/category-decoration.jpg
- images/category-cadeaux.jpg
- images/category-maison.jpg

Les vraies photos produits seront reliées dans un sprint futur.
