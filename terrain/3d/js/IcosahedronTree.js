var THREE = require('three');

function IcosahedronTree(radius, boundaries, transform, material)
{
    this.geometry = new THREE.IcosahedronGeometry(radius);
    this.mesh = new THREE.Mesh(this.geometry, material);
    this.material = material;
    this.radius = radius;
    this.boundaries = boundaries;
    this.transform = transform;
    this.faces = [];
    this.nearestDistance = Infinity;
    for (var i = 0; i < this.geometry.vertices.length; ++i)
    {
        var vertex = this.geometry.vertices[i];
        transform(vertex, 0);
    }
    for (var i = 0; i < this.geometry.faces.length; ++i)
        this.faces.push(new IcosahedronNode(this, this.geometry.faces[i], 0));
}

IcosahedronTree.prototype.update = function(position) {

    this.geometry = new THREE.IcosahedronGeometry(this.radius);
    this.faces = [];
    this.nearestDistance = Infinity;
    for (var i = 0; i < this.geometry.vertices.length; ++i)
    {
        var vertex = this.geometry.vertices[i];
        this.transform(vertex, 0);
    }
    for (var i = 0; i < this.geometry.faces.length; ++i)
        this.faces.push(new IcosahedronNode(this, this.geometry.faces[i], 0));

    for (var i = 0; i < this.faces.length; ++i)
    {
        this.faces[i].update(position);
    }
    this.geometry.mergeVertices();

    var geometry = new THREE.Geometry();
    geometry.vertices = this.geometry.vertices.slice();
    geometry.faces = this.geometry.faces.slice();
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    geometry.verticesNeedUpdate = true;
    geometry.normalsNeedUpdate = true;
    this.mesh = new THREE.Mesh(geometry, this.material);
    return this.mesh;
}

function IcosahedronNode(root, face, depth)
{
    this.depth = depth;
    this.root = root;
    this.face = face;
    /*var va = root.geometry.vertices[face.a];
    var vb = root.geometry.vertices[face.b];
    var vc = root.geometry.vertices[face.c];
    this.center = new THREE.Vector3().copy(va).add(vb).add(vc).multiplyScalar(1/3);*/
    this.children = [];
}

IcosahedronNode.prototype.boundary = function() {
    if (this.depth >= this.root.boundaries.length) return null;
    return this.root.boundaries[this.depth];
}

IcosahedronNode.prototype.update = function (position) {
    var boundary = this.boundary();
    if (boundary == null) return;
    var vertices = this.root.geometry.vertices;
    var distance = Math.min(
        position.distanceTo(vertices[this.face.a]),
        position.distanceTo(vertices[this.face.b]),
        position.distanceTo(vertices[this.face.c])
        );
    this.root.nearestDistance = Math.min(distance, this.root.nearestDistance);
    //console.log(boundary, distance);
    if (distance > boundary)
    {
        if (this.children.length > 0 && this.depth > 0)
        {
            this.root.geometry.faces.push(this.face);
            for (var i = 0; i < this.children.length; ++i)
                this.children[i].remove();
            this.children = [];
        }
    }
    else // closer than boundary
    {
        if (this.children.length == 0)
        {
            this.children = increaseDetail(this.root, 
                this.root.geometry.faces.indexOf(this.face),
                this.depth);
        }
        for (var i = 0; i < this.children.length; ++i)
        {
            this.children[i].update(position);
        }
    }
}

IcosahedronNode.prototype.remove = function () {
    for (var i = 0; i < this.children.length; ++i)
        this.children[i].remove();

    /*this.root.geometry.vertices.splice(this.face.a, 1);
    this.root.geometry.vertices.splice(this.face.b, 1);
    this.root.geometry.vertices.splice(this.face.c, 1);*/
    var fi = this.root.geometry.faces.indexOf(this.face);
    this.root.geometry.faces.splice(fi, 1);
    //this.root.geometry.mergeVertices();
}

function increaseDetail(root, faceIndex, depth)
{
    var geometry = root.geometry;
    var transform = root.transform;
    var face = geometry.faces[faceIndex];
    var vertices = geometry.vertices;
    var faces = geometry.faces;
    //console.log(vertices.length);
    //console.log(faces.length);

    var a = face.a;
    var b = face.b;
    var c = face.c;

    var nav = new THREE.Vector3().copy(vertices[a]).normalize();
    var nbv = new THREE.Vector3().copy(vertices[b]).normalize();
    var ncv = new THREE.Vector3().copy(vertices[c]).normalize();
    var ndv = new THREE.Vector3().addVectors(nav, nbv).normalize();
    var nev = new THREE.Vector3().addVectors(nav, ncv).normalize();
    var nfv = new THREE.Vector3().addVectors(ncv, nbv).normalize();

    transform(ndv, depth);
    transform(nev, depth);
    transform(nfv, depth);

    var d = vertices.push(ndv) - 1;
    var e = vertices.push(nev) - 1;
    var f = vertices.push(nfv) - 1;

    var face1 = new THREE.Face3(a, d, e);
    var face2 = new THREE.Face3(d, f, e);
    var face3 = new THREE.Face3(b, f, d);
    var face4 = new THREE.Face3(f, c, e);

    //console.log(a, b, c, d, e, f);

    geometry.faces.splice(faceIndex, 1);

    faces.push(face1);
    faces.push(face2);
    faces.push(face3);
    faces.push(face4);

    return [
        new IcosahedronNode(root, face1, depth + 1),
        new IcosahedronNode(root, face2, depth + 1),
        new IcosahedronNode(root, face3, depth + 1),
        new IcosahedronNode(root, face4, depth + 1)
    ]
}

module.exports = {
    IcosahedronTree: IcosahedronTree
};
