/**
 * Configuration globale pour l'animation WaveCanvas.
 * Centralise toutes les constantes magiques pour une meilleure maintenabilité.
 */

// === Paramètres de l'animation ===
export const ANIMATION_SPEED = 0.015; // Vitesse de l'animation (incrément de `time`)

// === Paramètres des particules ===
export const PARTICLE_DENSITY = 300; // Densité des particules (1 particule tous les X px²)
export const MAX_PARTICLES = 2000; // Plafond du nombre de particules (pour les performances)
export const BASE_SEA_LEVEL_RATIO = 0.65; // Niveau de la mer (65% de la hauteur de l'écran)

export const PARTICLE_SIZE_MIN = 10; // Taille minimale des particules (px)
export const PARTICLE_SIZE_MAX = 30; // Taille maximale des particules (px)
export const PARTICLE_SIZE_LARGE_MIN = 20; // Taille minimale pour les grandes particules (px)
export const PARTICLE_SIZE_LARGE_MAX = 30; // Taille maximale pour les grandes particules (px)

export const PARTICLE_MASS_MIN = 0.8; // Masse minimale des particules
export const PARTICLE_MASS_MAX = 1.2; // Masse maximale des particules

// === Paramètres de la vague ===
export const WAVE_FREQUENCY_1 = 0.003; // Fréquence de la première onde sinusoïdale
export const WAVE_AMPLITUDE_1 = 40; // Amplitude de la première onde (px)
export const WAVE_FREQUENCY_2 = 0.008; // Fréquence de la deuxième onde sinusoïdale
export const WAVE_AMPLITUDE_2 = 20; // Amplitude de la deuxième onde (px)
export const WAVE_SPEED_MULTIPLIER = 1.5; // Multiplicateur de vitesse pour la deuxième onde

export const WAVE_RADIUS_RATIO = 0.5; // Rayon de la vague (50% de la largeur de l'écran)
export const WAVE_SPEED = 3; // Vitesse de déplacement de la vague (px/frame)
export const WAVE_RESET_OFFSET = 800; // Offset pour réinitialiser la vague (px)
export const WAVE_Y_VARIATION = 150; // Variation aléatoire de la position Y de la vague (px)

// === Paramètres de la physique ===
export const GRAVITY = 0.5; // Force de gravité
export const SPRING_FORCE = 0.005; // Force du ressort pour revenir à la position cible
export const BASE_FLOW_FORCE = -0.5; // Force de flux horizontal de base
export const FLOW_DAMPING = 0.05; // Amortissement du flux
export const VELOCITY_DAMPING = 0.94; // Amortissement de la vélocité (0.94 = 6% de perte par frame)

export const TURBULENCE_FORCE = 2.0; // Force de la turbulence aléatoire

// === Paramètres de la mousse ===
export const FOAM_LIFE_DECAY = 0.015; // Décroissance de la vie de la mousse par frame
export const FOAM_LIFE_INITIAL = 1.0; // Vie initiale de la mousse
export const FOAM_LIFE_RANDOM = 0.6; // Vie aléatoire de la mousse (pour les crêtes)
export const FOAM_THRESHOLD = 30; // Seuil de hauteur pour déclencher la mousse (px)
export const FOAM_PROBABILITY = 0.02; // Probabilité de générer de la mousse aléatoire

// === Paramètres des collisions ===
export const GRID_CELL_SIZE = 60; // Taille des cellules de la grille spatiale (px)
export const MIN_DISTANCE = 24; // Distance minimale entre particules (px)
export const REPULSION_FORCE = 0.8; // Force de répulsion entre particules

// === Paramètres de rebond ===
export const BOUNCE_DAMPING = 0.5; // Amortissement du rebond au sol
export const FLOOR_OFFSET = 50; // Offset pour le sol (px)

// === Paramètres de bouclage ===
export const WRAP_OFFSET = 100; // Offset pour le bouclage horizontal (px)

// === Couleurs ===
export const COLORS = [
  '#0f2b46', // Bleu de Prusse
  '#1a3a5f', // Bleu foncé
  '#204b7a', // Bleu moyen
  '#3a6b9c', // Bleu clair
  '#5c8ebf', // Bleu très clair
];

// === Couleurs de fond ===
export const BACKGROUND_COLOR = '#e8e3d7'; // Fond "vieil papier"
export const CANVAS_CLEAR_COLOR = 'rgba(232, 227, 215, 0.35)'; // Couleur de nettoyage (avec opacité pour le motion blur)

// === Caractères ===
export const KANA = "\u3042\u3044\u3046\u3048\u304a\u304b\u304d\u304f\u3051\u3053\u3055\u3057\u3059\u305b\u305d\u305f\u3061\u3064\u3066\u3068\u306a\u306b\u306c\u306d\u306e\u306f\u3072\u3075\u3078\u307b\u307e\u307f\u3080\u3081\u3082\u3084\u3086\u3088\u3089\u308a\u308b\u308c\u308d\u308f\u3092\u3093\u30a2\u30a4\u30a6\u30a8\u30aa\u30ab\u30ad\u30af\u30b1\u30b3\u30b5\u30b7\u30b9\u30bb\u30bd\u30bf\u30c1\u30c4\u30c6\u30c8\u30ca\u30cb\u30cc\u30cd\u30ce\u30cf\u30d2\u30d5\u30d8\u30db\u30de\u30df\u30e0\u30e1\u30e2\u30e4\u30e6\u30e8\u30e9\u30ea\u30eb\u30ec\u30ed\u30ef\u30f2\u30f3\u6d77\u6ce2\u6c34\u98a8\u6d6e\u4e16\u7d75";
