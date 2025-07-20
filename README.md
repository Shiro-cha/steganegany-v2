
# Steganegany v2

Steganegany v2 est une application web de stéganographie combinant sécurité, interface moderne et génération de contenu assistée par intelligence artificielle.

Elle permet de cacher des messages dans des images à l’aide d’un algorithme basé sur des paramètres dynamiques (offset, canal, pas, timestamp). L’interface a été développée avec Next.js et intègre un assistant IA via Gemini pour enrichir ou reformuler les messages à encoder.

## Fonctionnalités

- Encodage et décodage de messages dans des images (PNG/JPG)
- Algorithme basé sur une séquence de paramètres :
  - Offset (pixel de départ)
  - Pas (écart entre chaque pixel utilisé)
  - Canal de couleur (Rouge, Vert, Bleu)
  - Timestamp (clé dynamique)
- Interface web moderne et responsive avec Next.js
- Génération de texte assistée par l’IA Gemini (Google AI)

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/Shiro-cha/steganegany-v2.git
cd steganegany-v2
````

### 2. Installer les dépendances

```bash
npm install
# ou
yarn install
```

### 3. Configurer l’environnement

Crée un fichier `.env.local` à la racine du projet et ajoute la clé :

```env
NEXT_PUBLIC_GEMINI_API_KEY="you_key"
```

Générer cette clé sur [Google AI Studio](https://aistudio.google.com/apikey).

### 4. Lancer le serveur de développement

```bash
npm run dev
# ou
yarn dev
```

Accède ensuite à l'application sur `http://localhost:3000`.

## Exemple de clé de décodage
```csv
54,82,3,2,624,850
```

```
Taille : 54 caractères
Offset : pixel 82
Pas : 3
Canal : Bleu
Timestamp : 850
```

Cette clé est indispensable pour retrouver le message caché dans l’image.


## Build pour production

```bash
npm run build
npm start
```

## Fonctionnement de l’IA

L’intégration de Gemini permet de :

* Reformuler un message avant encodage
* Générer automatiquement des textes créatifs


## Auteur

[Shiro-cha](https://github.com/Shiro-cha)

