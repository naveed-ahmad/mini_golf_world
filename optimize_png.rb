pngs =  Dir["./www/sprites/*.png"] + Dir["./www/sprites/*/*.png"] + Dir["./www/sprites/*.png"]
jpg = Dir["./www/sprites/*/*.jpg"] + Dir["./www/sprites/*.jpg"]

pngs.each do |f|
  `pngquant  -f --verbose --quality 40  --output #{f} #{f}`
end

jpg.each do |f|
  `pngquant  -f --verbose --quality 30  --output #{f} #{f}`
end


require "tinify"
Tinify.key = "YZRqjts9pKFq2qghK4SWDNy4hfhWyw0w"

pngs.each do |f|
  puts "optimizing #{f}"

  source = Tinify.from_file(f)
  source.to_file(f)
end

jpg.each do |f|
  source = Tinify.from_file(f)
  source.to_file(f)
end