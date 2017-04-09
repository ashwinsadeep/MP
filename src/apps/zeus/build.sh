app_dir=/vagrant/mp-zeus/src/apps/zeus/static_content
babel --presets react $app_dir/jsx --out-dir $app_dir/js
browserify $app_dir/js/main.js > $app_dir/js/build/main.js
