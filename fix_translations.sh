#!/bin/bash
file="src/pages/Collezione.tsx"

# Angelo Leidi
sed -i '' "s/t('critics.angeloLeidi.text')/(t('critics') as any)?.angeloLeidi?.text/g" "$file"

# Leonardo Varasano  
sed -i '' "s/t('critics.leonardoVarasano.role')/(t('critics') as any)?.leonardoVarasano?.role/g" "$file"
sed -i '' "s/t('critics.leonardoVarasano.text')/(t('critics') as any)?.leonardoVarasano?.text/g" "$file"

# Celeste More
sed -i '' "s/t('critics.celesteMore.role')/(t('critics') as any)?.celesteMore?.role/g" "$file"
sed -i '' "s/t('critics.celesteMore.text')/(t('critics') as any)?.celesteMore?.text/g" "$file"

# Marco Botti
sed -i '' "s/t('critics.marcoBotti.role')/(t('critics') as any)?.marcoBotti?.role/g" "$file"
sed -i '' "s/t('critics.marcoBotti.text')/(t('critics') as any)?.marcoBotti?.text/g" "$file"

# Helen Pankhurst
sed -i '' "s/t('critics.helenPankhurst.role')/(t('critics') as any)?.helenPankhurst?.role/g" "$file"
sed -i '' "s/t('critics.helenPankhurst.text')/(t('critics') as any)?.helenPankhurst?.text/g" "$file"

# Alessandra Boldreghini
sed -i '' "s/t('critics.alessandraBoldreghini.role')/(t('critics') as any)?.alessandraBoldreghini?.role/g" "$file"
sed -i '' "s/t('critics.alessandraBoldreghini.text')/(t('critics') as any)?.alessandraBoldreghini?.text/g" "$file"

# Donato Loscalzo
sed -i '' "s/t('critics.donatoLoscalzo.role')/(t('critics') as any)?.donatoLoscalzo?.role/g" "$file"
sed -i '' "s/t('critics.donatoLoscalzo.text')/(t('critics') as any)?.donatoLoscalzo?.text/g" "$file"

# Alessandra Primicerio
sed -i '' "s/t('critics.alessandraPrimicerio.role')/(t('critics') as any)?.alessandraPrimicerio?.role/g" "$file"
sed -i '' "s/t('critics.alessandraPrimicerio.text')/(t('critics') as any)?.alessandraPrimicerio?.text/g" "$file"

# Emidio De Albentiis
sed -i '' "s/t('critics.emidioDeAlbentiis.role')/(t('critics') as any)?.emidioDeAlbentiis?.role/g" "$file"
sed -i '' "s/t('critics.emidioDeAlbentiis.text')/(t('critics') as any)?.emidioDeAlbentiis?.text/g" "$file"

echo "All translations fixed!"
