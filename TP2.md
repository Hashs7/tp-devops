# TP2

## 1. Convention de coding
Dans le cadre d'une application en JS :  

La taille d'indentation sont de 2 espaces pour éviter de mixer les différents types d'indentation.

Utiliser uniquement les single quotes.

Pour la définition d'une classe et pour le nom de fichier utiliser le PascalCase.  
Pour la définition de variable, afin de les différencier des classes utiliser le camelCase.  
Pour la définition de constantes, afin de les différencer rapidement des variables qui sont modifiables utiliser l'UPPERCASE.

Lors de la définition d'une fonction, ouvrir les accolades sur la même ligne afin de rester concis.

```
// Do
function myFunction {
}
// Don't
function myFunction
{
}
```
Limiter le nombre de paramètres de fonction à 4 maximum.


## 2. Choix d’infrastructure

### Les services et l'équipe
Pour déployer une api telle que celle du repo FlickR. Nous pouvons utiliser ces différents services :  
Pour le stockage de fichier, on pourrait utiliser Google Cloud Storage pour servir les images via CDN.
Et on peut utiliser Google App Engine pour l'hébergement du site. Son avantage sera de pouvoir être scalable en fonction du trafic.
Nous pourrions avoir besoin de 3 développeurs : Un développeur Back-end Senior Node.js, un développeur Back-end en apprentissage et un développeur Front-end junior.

### Le coût
Pour l'estimation du coup du Cloud storage, en considérant le poids d'une image moyen de 300 Ko, que chaque utilisateur poste une photo par semaine, et que le service est utilisé par 50 000 utilisateurs par mois on peut considérer qu'on a besoin d'un storage de 60 To à 1000€.
Pour le coût de l'hébergement, pour 6 cpu mobilisé de manière standard et jusqu'à 14 en pic de trafic, cela pourrait 200€.
Pour le salaire du développeur Back-end Senior 3100€, 2600€ pour ledéveloppeur Front-end Junior et 1200€ pour le développeur Back-end en alternance. 
La fourchette large pour le coût total par mois pourrait être 8100€.

On pourrait avoir besoin d'une base NoSQL si nous avons à gérer des profils utilisateurs avec leurs images favoris par exemple.  