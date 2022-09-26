<template>
  <footer class="footer fixed-bottom">
    <p class="footer-text">
      Gulcan COSKUN | OpenClassrooms Project 7 - Groupmania | September, 2022
    </p>
  </footer>
</template>

<style scoped>
:root {
  --primary-color: "#fd2d01";
  --secondary-color: #ffd7d7;
  --tertiary-color: "#4E5166";
}
footer {
  background-color: #4e5166;
  width: 100%;
  height: 5rem;
  position: absolute;
}
footer p {
  margin: 1.7rem;
  background: transparent;
  color: white;
  font-size: 1rem;
  transition: all 0.2s;
}
footer p:hover {
  color: #ffd7d7;
}

/* @media (max-width: 992px) {
  footer {
    text-align: center;
    font-size: 1.2rem;
  }
}
@media (max-width: 398px) {
  footer {
    background-color: #4e5166;
    width: 120%;
    height: auto;
    position: absolute;
    text-align: center;
  }
} */
</style>
