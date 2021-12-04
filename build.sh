docker stop test
docker container prune -f
docker push -t kchou0907/restaurant-roulette .
docker pull kchou0907/restaurant-roulette
