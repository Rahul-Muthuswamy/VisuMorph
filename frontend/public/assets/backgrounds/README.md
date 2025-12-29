# Background Images Structure

This folder contains background images organized by emotion scores.

## Folder Structure

```
assets/backgrounds/
├── happy/
│   ├── score_1_set1.jpg
│   ├── score_1_set2.jpg
│   ├── score_2_set1.jpg
│   ├── score_2_set2.jpg
│   ├── score_3_set1.jpg
│   ├── score_3_set2.jpg
│   ├── score_4_set1.jpg
│   ├── score_4_set2.jpg
│   ├── score_5_set1.jpg
│   └── score_5_set2.jpg
├── sad/
│   ├── score_-1_set1.jpg
│   ├── score_-1_set2.jpg
│   ├── score_-2_set1.jpg
│   ├── score_-2_set2.jpg
│   ├── score_-3_set1.jpg
│   ├── score_-3_set2.jpg
│   ├── score_-4_set1.jpg
│   ├── score_-4_set2.jpg
│   ├── score_-5_set1.jpg
│   └── score_-5_set2.jpg
└── neutral/
    ├── score_0_set1.jpg
    └── score_0_set2.jpg
```

## Emotion Scores

- **Happy**: Scores from +1 to +5 (positive emotions)
- **Sad**: Scores from -1 to -5 (negative emotions)
- **Neutral**: Score 0 (neutral emotion)

## Image Sets

Each score has **2 sets** of images:
- `set1`: First set of images
- `set2`: Second set of images

The system alternates between set1 and set2 to provide variety when the same score is calculated multiple times.

## Naming Convention

Images are named using the pattern:
```
score_{SCORE}_set{SET_NUMBER}.jpg
```

Examples:
- `score_5_set1.jpg` - Very happy, first set
- `score_5_set2.jpg` - Very happy, second set
- `score_-3_set1.jpg` - Moderately sad, first set
- `score_0_set1.jpg` - Neutral, first set

## Total Images Required

- Happy scores (1-5): 5 scores × 2 sets = **10 images**
- Sad scores (-1 to -5): 5 scores × 2 sets = **10 images**
- Neutral (0): 1 score × 2 sets = **2 images**

**Total: 22 images**

## Image Generation

These images should be generated using a Google Image Generator AI or similar tool, ensuring:
- High quality (recommended: 1920x1080 or higher)
- Appropriate for video backgrounds
- Matching the emotion intensity of the score
- Consistent style across all images

## Fallback

If an image is not found, the system will automatically use a gradient background that matches the emotion score and intensity.


