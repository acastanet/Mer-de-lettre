<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# La Mer de Lettres

> Une animation de vagues inspirée de la *Grande Vague de Kanagawa* d'Hokusai, où les particules sont remplacées par des caractères japonais (kana) et des idéogrammes liés à la mer.

**Démo en direct** : [AI Studio App](https://ai.studio/apps/10172d25-68af-4351-8994-57d415aad579)

## ✨ Fonctionnalités
- Animation fluide de vagues avec physique réaliste.
- Particules sous forme de caractères japonais (hiragana, katakana, idéogrammes).
- Effet de mousse dynamique sur les crêtes des vagues.
- Anti-amas pour éviter les superpositions de particules.
- **Contrôles utilisateur** :
  - Pause/reprise de l'animation.
  - Réglage de la densité des particules.
  - Option pour réduire le mouvement (accessibilité).

## 🚀 Installation et Exécution

### Prérequis
- [Node.js](https://nodejs.org/) (version ≥ 18 recommandée).

### Étapes
1. Cloner le dépôt :
   ```bash
   git clone https://github.com/acastanet/Mer-de-lettre.git
   cd Mer-de-lettre
   ```
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```
   L'application sera disponible sur [http://localhost:3000](http://localhost:3000).

## 📦 Scripts Disponibles
| Commande          | Description                          |
|-------------------|--------------------------------------|
| `npm run dev`     | Lance le serveur de développement.   |
| `npm run build`   | Compile l'application pour la production. |
| `npm run preview` | Prévualise le build de production.   |
| `npm run clean`   | Supprime le dossier `dist`.          |
| `npm run lint`    | Vérifie les erreurs TypeScript.      |

## 🎛️ Contrôles
- **⚙️ Contrôles** : Cliquez sur le bouton en bas à gauche pour afficher/masquer le panneau de contrôles.
- **⏸/▶** : Mettre en pause ou reprendre l'animation.
- **Densité** : Ajustez le curseur pour modifier le nombre de particules (impacte les performances).
- **Réduire le mouvement** : Cochez cette option pour limiter les animations (accessibilité).

## 🛠️ Configuration
Les paramètres de l'animation (vitesse, densité, couleurs, etc.) sont centralisés dans [`src/config.ts`](src/config.ts).

## 📂 Structure du Projet
```
Mer-de-lettre/
├── index.html              # Point d'entrée HTML
├── package.json            # Dépendances et scripts
├── tsconfig.json           # Configuration TypeScript
├── vite.config.ts          # Configuration Vite
├── README.md               # Documentation
├── metadata.json           # Métadonnées pour AI Studio
└── src/
    ├── main.tsx            # Rend l'app React
    ├── App.tsx             # Composant principal
    ├── index.css           # Styles globaux (Tailwind)
    ├── config.ts           # ✨ Constantes de configuration
    └── components/
        └── WaveCanvas.tsx  # Animation des vagues
```

## 🎨 Technologies Utilisées
- **Frontend** : [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler** : [Vite 6](https://vitejs.dev/)
- **Styles** : [Tailwind CSS 4](https://tailwindcss.com/)
- **Animation** : Canvas HTML5 (via `<canvas>`)

## 🤝 Contribuer
Les contributions sont les bienvenues ! Ouvrez une *Pull Request* ou un *Issue* pour proposer des améliorations.

## 📜 Licence
Ce projet est sous licence **Apache-2.0**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
