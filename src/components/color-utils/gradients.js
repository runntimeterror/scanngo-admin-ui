export const GRADIENTS = {
  YELLOW: `linear-gradient(60deg, #ffa726, #fb8c00)`,
  GREEN: `linear-gradient(60deg, #66bb6a, #43a047)`,
  BLACK: `linear-gradient(60deg, #263238, #212121)`,
  RED: `linear-gradient(60deg, #ef5350, #e53935)`,
  BLUE: `linear-gradient(60deg, #26c6da, #00acc1)`,
};

export function pickRandomGradient() {
  var keys = Object.keys(GRADIENTS);
  var randomIndex = Math.floor(Math.random() * keys.length);
  return GRADIENTS[keys[randomIndex]];
}
