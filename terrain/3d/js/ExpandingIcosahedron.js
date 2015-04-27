var THREE = require('three');

function ExpandingIcosahedron(boundaries, material, transform)
{
    var a = new THREE.Vector3(2, 1, 0);
    var b = new THREE.Vector3(-2, 1, 0);
    var c = new THREE.Vector3(2, -1, 0);
    var d = new THREE.Vector3(-2, -1, 0);
    var e = new THREE.Vector3(1, 0, 2);
    var f = new THREE.Vector3(-1, 0, 2);
    var g = new THREE.Vector3(1, 0, -2);
    var h = new THREE.Vector3(-1, 0, -2);
    var i = new THREE.Vector3(0, 2, 1);
    var j = new THREE.Vector3(0, -2, 1);
    var k = new THREE.Vector3(0, 2, -1);
    var l = new THREE.Vector3(0, -2, -1);

    /*this.vertices = [a, b, c, d, e, f, g, h, i, j, k, l];

    for (var i = 0; i < this.vertices.length; ++i)
        transform(this.vertices[i]);*/

    /*this.faces = [
        new THREE.Face3(0, 8, 4),
        new THREE.Face3(0, 4, 2),
        new THREE.Face3(5, 8, 1),
        new THREE.Face3(4, 8, 5),
        new THREE.Face3(1, 8, 10),
        new THREE.Face3(8, 0, 10),
        new THREE.Face3(0, 2, 6),
        new THREE.Face3(0, 6, 10),
        new THREE.Face3(6, 7, 10),
        new THREE.Face3(7, 1, 10),
        new THREE.Face3(7, 3, 1),
        new THREE.Face3(5, 1, 3),
        new THREE.Face3(5, 9, 4),
        new THREE.Face3(5, 3, 9),
        new THREE.Face3(9, 2, 4),
        new THREE.Face3(9, 11, 2),
        new THREE.Face3(9, 3, 11),
        new THREE.Face3(7, 11, 3),
        new THREE.Face3(6, 2, 11),
        new THREE.Face3(7, 6, 11)
    ]*/

    var anode = new EINode(a, 0);
    var bnode = new EINode(b, 0);
    var cnode = new EINode(c, 0);
    var dnode = new EINode(d, 0);
    var enode = new EINode(e, 0);
    var fnode = new EINode(f, 0);
    var gnode = new EINode(g, 0);
    var hnode = new EINode(h, 0);
    var inode = new EINode(i, 0);
    var jnode = new EINode(j, 0);
    var knode = new EINode(k, 0);
    var lnode = new EINode(l, 0);

    /*anode.neighbors = [inode, enode, knode, gnode, cnode];
    bnode.neighbors = [inode, knode, fnode, hnode, dnode];
    cnode.neighbors = [gnode, lnode, jnode, anode, enode];
    dnode.neighbors = [hnode, lnode, jnode, fnode, bnode];
    enode.neighbors = [anode, inode, fnode, cnode, jnode];
    fnode.neighbors = [bnode, inode, enode, dnode, jnode];
    gnode.neighbors = [hnode, lnode, cnode, anode, knode];
    hnode.neighbors = [gnode, lnode, dnode, knode, bnode];
    inode.neighbors = [anode, enode, fnode, bnode, knode];
    jnode.neighbors = [cnode, lnode, dnode, enode, fnode];
    knode.neighbors = [anode, inode, bnode, gnode, hnode];
    lnode.neighbors = [cnode, gnode, hnode, dnode, jnode];*/

    anode.neighbors = [2, 4, 8, 10, 6];
    bnode.neighbors = [8, 5, 3, 7, 10];
    cnode.neighbors = [4, 0, 6, 11, 9];
    dnode.neighbors = [7, 1, 5, 9, 11];
    enode.neighbors = [8, 0, 2, 9, 5];
    fnode.neighbors = [1, 8, 4, 9, 3];
    gnode.neighbors = [7, 11, 2, 0, 10];
    hnode.neighbors = [6, 10, 1, 3, 11];
    inode.neighbors = [0, 4, 5, 1, 10];
    jnode.neighbors = [2, 11, 3, 5, 4];
    knode.neighbors = [0, 8, 1, 7, 6];
    lnode.neighbors = [2, 6, 7, 3, 9];

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
    ]

    this.boundaries = boundaries;
    this.material = material;
    this.transform = transform;
    this.nearestDistance = 10000000;
}

ExpandingIcosahedron.prototype.toggleWireframe = function() {
    this.material.wireframe = !this.material.wireframe;
}

ExpandingIcosahedron.prototype.update = function(position) {
    var geometry = createGeometry(this);

    this.mesh = new THREE.Mesh(geometry, this.material);
    return this.mesh;
}

function createGeometry(ico) {
    var geometry = new THREE.Geometry();
    geometry.vertices = [];
    for (var i = 0; i < ico.nodes.length; ++i)
    {
        var v = new THREE.Vector3().copy(ico.nodes[i].point);
        ico.transform(v);
        geometry.vertices.push(v);
    }
    geometry.faces = [];

    var seen = [];
    for (var i = 0; i < ico.nodes.length; ++i)
        seen.push(false);

    for (var i = 0; i < ico.nodes.length; ++i)
    {
        var node = ico.nodes[i];

        var a = node.neighbors[0];
        var b = node.neighbors[1];
        var c = node.neighbors[2];
        var d = node.neighbors[3];
        var e = node.neighbors[4];

        if (!seen[a] && !seen[b])
            geometry.faces.push(new THREE.Face3(a, i, b));
        if (!seen[b] && !seen[c])
            geometry.faces.push(new THREE.Face3(b, i, c));
        if (!seen[c] && !seen[d])
            geometry.faces.push(new THREE.Face3(c, i, d));
        if (!seen[d] && !seen[e])
            geometry.faces.push(new THREE.Face3(d, i, e));
        if (!seen[e] && !seen[a])
            geometry.faces.push(new THREE.Face3(e, i, a));

        seen[i] = true;
    }

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.verticesNeedUpdate = true;
    geometry.normalsNeedUpdate = true;

    return geometry;
}

function EINode(point, lod)
{
    this.point = point;
    this.neighbors = [];
    this.lod = lod;
}

module.exports = {
    ExpandingIcosahedron: ExpandingIcosahedron
};
