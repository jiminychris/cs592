build: perlin2d	perlin3d terrain2d terrain3d

perlin2d:
	$(MAKE) rebuild -C perlin/2d/

perlin3d:
	$(MAKE) rebuild -C perlin/3d/

terrain2d:
	$(MAKE) rebuild -C terrain/2d/

terrain3d:
	$(MAKE) rebuild -C terrain/3d/
