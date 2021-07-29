rsync -r src/ docs/
rsync build/contracts/* docs/
sudo git add .
sudo git commit -m "Compiles assets for Github Pages"
sudo git push -u origin main