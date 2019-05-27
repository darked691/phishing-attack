Attaque de Phishing Facebook
=================

Voici une démonstration d'une attaque de phishing sur Facebook. L'attaquant va donc créer un site web représentant Facebook qui stockera les informations personnelles des victimes. 
La victime va croire qu'elle est sur la page officielle Facebook alors qu'elle est en réalité sur [https://fr-facebook.glitch.me](https://fr-facebook.glitch.me).

Création de la fausse page de connexion
------------

On va d'abord récupèrer à l'aide des outils du développeur le code HTML de la page de connexion. On modifiera par la suite la requête POST de la page de connexion pour 
pointer vers */login* afin qu'on enregistre les champs choisis par l'utilisateur (email et mot de passe).

On modifiera également les champs du header afin de rendre crédible un partage sur un forum par exemple. Si on le partage, cela donne cela : 

![Partage](https://cdn.glitch.com/415bba73-a3df-4a23-bcac-f85130dac3a9%2Fpartage.PNG?1558963183033)


Pointeur vers la vraie page facebook à partager
---------------------------------------------

Pour pouvoir pointer vers la vraie page Facebook à partager lors du phishing, nous allons chercher sur la page officielle de Facebook un meme d'une série très populaire : 

![Meme Facebook](https://cdn.glitch.com/415bba73-a3df-4a23-bcac-f85130dac3a9%2Fmeme.PNG?1558879824726)

qui se trouve à l'adresse [https://www.facebook.com/GoTMemes/photos/a.299630363448361/2260416757369702/?type=3&theater](https://www.facebook.com/GoTMemes/photos/a.299630363448361/2260416757369702/?type=3&theater)

Puis, on va récupérer son lien d'intégration : 

![Boutons du bas](https://cdn.glitch.com/415bba73-a3df-4a23-bcac-f85130dac3a9%2Foption.PNG?1558880002220)

![Integrer](https://cdn.glitch.com/415bba73-a3df-4a23-bcac-f85130dac3a9%2Fintegrer.PNG?1558880001035)

![Lien](https://cdn.glitch.com/415bba73-a3df-4a23-bcac-f85130dac3a9%2Flien.PNG?1558879852827)

On obtient donc le lien suivant : 

```html
<iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FGoTMemes%2Fphotos%2Fa.299630363448361%2F2260416757369702%2F%3Ftype%3D3&width=500" width="500" height="503" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media"></iframe>
```

On va donc concaténer cette portion de lien : 

```html
https://www.facebook.com/login/?next=
```
avec une portion du lien du meme (entre le href et les balises de taille), c'est-à-dire : 

```html
https%3A%2F%2Fwww.facebook.com%2FGoTMemes%2Fphotos%2Fa.299630363448361%2F2260416757369702
```

Et on obtient donc l'adresse suivante : 

```html
https://www.facebook.com/login/?next=https%3A%2F%2Fwww.facebook.com%2FGoTMemes%2Fphotos%2Fa.299630363448361%2F2260416757369702
```

Cette adresse correspond donc à l'adresse qui sera pointée lors de la redirection de la page de l'attaquant. 

On fait donc en sorte qu'après avoir tapé ses coordonnées sur le faux site de Facebook, on le redirige vers le vrai site web. Ainsi, si sa session était déjà ouverte, 
la victime sera redirigé directement vers l'image du meme.

Exemple du comportement de ce phishing
---------------------------------------

On suppose que la victime est Toto. Son adresse mail facebook sera toto@titi.fr et son mot de passe *totopassword*. Toto va donc cliquer sur le lien du partage de l'attaquant. 

Il sera donc sur cette page : 

![Connexion](https://cdn.glitch.com/415bba73-a3df-4a23-bcac-f85130dac3a9%2Ffausse_connexion.PNG?1558964059558)

Côté attaquant, il se connecte sur [https://fr-facebook.glitch.me](https://fr-facebook.glitch.me), s'identifie et obtient : 

![Hacker side](https://cdn.glitch.com/415bba73-a3df-4a23-bcac-f85130dac3a9%2Fhacker.PNG?1558964058829)

L'attaquant a bien les informations privées de Toto.


Ce dépot fait référence à mon dépôt Glitch [https://glitch.com/~fr-facebook](https://glitch.com/~fr-facebook).