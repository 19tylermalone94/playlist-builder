export const kmeansClusters = (userSelectedTracks, rawPopulation) => {
  const centroids = normalize(userSelectedTracks);
  const population = normalize(rawPopulation);

  console.log('Initial centroids:', centroids);
  console.log('Population:', population);

  let clusters = Array(centroids.length).fill().map(() => []);
  for (let i = 0; i < 20; i++) {
    clusters = Array(centroids.length).fill().map(() => []);
    population.forEach(track => {
      let closestCentroidIndex = 0;
      let minDistance = Infinity;
      centroids.forEach((centroid, index) => {
        const distance = euclideanDistance(track.features, centroid.features);
        if (distance < minDistance) {
          minDistance = distance;
          closestCentroidIndex = index;
        }
      });
      clusters[closestCentroidIndex].push(track);
    });
    centroids.forEach((centroid, index) => {
      if (clusters[index].length > 0) {
        centroid.features = averageFeatures(clusters[index]);
      }
    });
  }

  const topTenClusters = clusters.map(cluster => {
    const seen = new Set();
    const sorted = cluster.sort((a, b) => {
      return euclideanDistance(a.features, centroids[clusters.indexOf(cluster)].features) - euclideanDistance(b.features, centroids[clusters.indexOf(cluster)].features);
    });
    const topTen = [];
    for (let track of sorted) {
      if (!seen.has(track.id)) {
        topTen.push(track);
        seen.add(track.id);
        if (topTen.length === 10) break;
      }
    }
    return topTen;
  });
  
  console.log('Top 10 Tracks in Clusters:', topTenClusters);
  return { centroids, topTenClusters };
};

const normalize = (tracks) => {
  const featureNames = Object.keys(tracks[0].features);
  let mins = {};
  let maxs = {};
  featureNames.forEach(feature => {
    mins[feature] = Math.min(...tracks.map(track => track.features[feature]));
    maxs[feature] = Math.max(...tracks.map(track => track.features[feature]));
  });
  return tracks.map(track => {
    let normalizedFeatures = {};
    for (let feature of featureNames) {
      normalizedFeatures[feature] = (track.features[feature] - mins[feature]) / (maxs[feature] - mins[feature]);
    }
    return { ...track, features: normalizedFeatures };
  });
};

const euclideanDistance = (features1, features2) => {
  const featureNames = Object.keys(features1);
  let sum = 0;
  featureNames.forEach(feature => {
    sum += (features1[feature] - features2[feature]) ** 2;
  });
  return Math.sqrt(sum);
};

const averageFeatures = (tracks) => {
  const featureNames = Object.keys(tracks[0].features);
  let sumFeatures = {};
  tracks.forEach(track => {
    featureNames.forEach(feature => {
      sumFeatures[feature] = (sumFeatures[feature] || 0) + track.features[feature];
    });
  });
  let avgFeatures = {};
  featureNames.forEach(feature => {
    avgFeatures[feature] = sumFeatures[feature] / tracks.length;
  });
  return avgFeatures;
};