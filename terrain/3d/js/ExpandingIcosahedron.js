var THREE = require('three');

function ExpandingIcosahedron(boundaries, material, transform)
{
    this.flag = false;
    this.boundaries = boundaries;
    this.material = material;
    this.transform = transform;
    this.nearestDistance = 10000000;

    var a = new THREE.Vector3(2, 1, 0).normalize();
    var b = new THREE.Vector3(-2, 1, 0).normalize();
    var c = new THREE.Vector3(2, -1, 0).normalize();
    var d = new THREE.Vector3(-2, -1, 0).normalize();
    var e = new THREE.Vector3(1, 0, 2).normalize();
    var f = new THREE.Vector3(-1, 0, 2).normalize();
    var g = new THREE.Vector3(1, 0, -2).normalize();
    var h = new THREE.Vector3(-1, 0, -2).normalize();
    var i = new THREE.Vector3(0, 2, 1).normalize();
    var j = new THREE.Vector3(0, -2, 1).normalize();
    var k = new THREE.Vector3(0, 2, -1).normalize();
    var l = new THREE.Vector3(0, -2, -1).normalize();

    var anode = new EINode(this, 0, a, [ 2,  4,  8, 10,  6], 0);
    var bnode = new EINode(this, 1, b, [ 8,  5,  3,  7, 10], 0);
    var cnode = new EINode(this, 2, c, [ 4,  0,  6, 11,  9], 0);
    var dnode = new EINode(this, 3, d, [ 7,  1,  5,  9, 11], 0);
    var enode = new EINode(this, 4, e, [ 8,  0,  2,  9,  5], 0);
    var fnode = new EINode(this, 5, f, [ 1,  8,  4,  9,  3], 0);
    var gnode = new EINode(this, 6, g, [ 7, 11,  2,  0, 10], 0);
    var hnode = new EINode(this, 7, h, [ 6, 10,  1,  3, 11], 0);
    var inode = new EINode(this, 8, i, [ 0,  4,  5,  1, 10], 0);
    var jnode = new EINode(this, 9, j, [ 2, 11,  3,  5,  4], 0);
    var knode = new EINode(this, 10, k, [ 0,  8,  1,  7,  6], 0);
    var lnode = new EINode(this, 11, l, [ 2,  6,  7,  3,  9], 0);

    this.nodes = [
        anode,
        bnode,
        cnode,
        dnode,
        enode,
        fnode,
        gnode,
        hnode,
        inode,
        jnode,
        knode,
        lnode
    ];

    for (var i = 0; i < this.nodes.length; ++i)
        this.nodes[i].transform();
}

ExpandingIcosahedron.prototype.toggleWireframe = function() {
    this.material.wireframe = !this.material.wireframe;
}

ExpandingIcosahedron.prototype.update = function(position) {
    var geometry = createGeometry(this);

    for (var i = 0; i < this.nodes.length; ++i)
    {
        this.nodes[i].update(position);
    }

    this.mesh = new THREE.Mesh(geometry, this.material);
    return this.mesh;
}

function createGeometry(ico) {
    var geometry = new THREE.Geometry();
    geometry.vertices = [];
    for (var i = 0; i < ico.nodes.length; ++i)
    {
        var v = new THREE.Vector3().copy(ico.nodes[i].point);
        geometry.vertices.push(v);
    }
    geometry.faces = [];

    var seen = [];
    for (var i = 0; i < ico.nodes.length; ++i)
        seen.push(false);

    for (var i = 0; i < ico.nodes.length; ++i)
    {
        var node = ico.nodes[i];

        for (var j = 0; j < node.neighbors.length; ++j)
        {
            var k = j + 1;
            if (k == node.neighbors.length) k = 0;
            var a = node.neighbors[j];
            var b = node.neighbors[k];
            if (!seen[a] && !seen[b])
                geometry.faces.push(new THREE.Face3(a, i, b))
        }

        seen[i] = true;
    }

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.verticesNeedUpdate = true;
    geometry.normalsNeedUpdate = true;

    if (ico.flag) console.log(geometry);
    ico.flag = false;

    return geometry;
}

function EINode(ico, index, point, neighbors, lod)
{
    this.ico = ico;
    this.index = index;
    this.point = point;
    this.neighbors = neighbors;
    this.lod = lod;
    this.lodStack = [];
}

EINode.prototype.distanceTo = function(vector) {
    return vector.distanceTo(this.point);
}

EINode.prototype.update = function(position) {
    if (this.lod >= this.ico.boundaries.length) return;
    var distance = this.distanceTo(position);
    if (distance < this.ico.boundaries[this.lod])
    {
        this.expand();
        console.log(this.ico.nodes);
    }
}

EINode.prototype.transform = function () {
    this.ico.transform(this.point);
}

EINode.prototype.expand = function() {
    this.ico.flag = true;
    var ico = this.ico;
    var nodes = ico.nodes;
    var point = this.point;
    var neighbors = this.neighbors;
    this.lodStack.push(this.lod);
    this.lod += 1;
    var inner = [];
    var outer = [];
    var nextIndex = nodes.length;

    for (var i = 0; i < neighbors.length; ++i)
    {
        var neighbor = nodes[neighbors[i]];
        var selfi = neighbor.neighbors.indexOf(this.index);
        neighbor.neighbors[selfi] = i + nextIndex;
        var newPoint = new THREE.Vector3().addVectors(point, neighbor.point).normalize();
        var n1 = nextIndex + (i + 1 == neighbors.length ? 0 : i + 1);
        var n2 = nextIndex + (i - 1 == -1 ? neighbors.length-1 : i - 1);
        var newNeighbors = [
            this.index, 
            n2,
            n2 + neighbors.length,
            neighbors[i], 
            n1 + neighbors.length - 1,
            n1
            ]
        inner.push(new EINode(ico, nextIndex + i, newPoint, newNeighbors, this.lod));

        var nextNeighbor = nodes[i + 1 == neighbors.length ? neighbors[0] : neighbors[i + 1]];
        var prevNeighbor = nodes[i - 1 == -1 ? neighbors[neighbors.length - 1] : neighbors[i - 1]];
        var nextNeighbori = nextNeighbor.neighbors.indexOf(neighbor.index);
        var prevNeighbori = prevNeighbor.neighbors.indexOf(neighbor.index);
        neighbor.neighbors[nextNeighbori] = n1 + neighbors.length - 1;
        neighbor.neighbors[prevNeighbori] = n2 + neighbors.length;
        var oPoint = new THREE.Vector3().addVectors(neighbor.point, nextNeighbor).multiplyScalar(.5);
        var oNeighbors = [
            nextNeighbor.index,
            n1, 
            nextIndex + i, 
            neighbor.index, 
            ];
        outer.push(new EINode(ico, nextIndex + i + neighbors.length, oPoint, oNeighbors, this.lod - .5));
    }

    this.neighbors = []
    for (var i = 0; i < neighbors.length; ++i)
        this.neighbors.push(i + nextIndex);

    for (var i = 0; i < inner.length; ++i)
    { 
        inner[i].transform();
        nodes.push(inner[i]);
    }
    for (var i = 0; i < outer.length; ++i) 
        nodes.push(outer[i]);
}

module.exports = {
    ExpandingIcosahedron: ExpandingIcosahedron
};
