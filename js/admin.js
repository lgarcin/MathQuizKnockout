MathJax.Hub.Config({
	tex2jax : {
		inlineMath : [['$', '$'], ['\\[', '\\]']]
	},
	"HTML-CSS" : {
		scale : 110
	},
	TeX : {
		Macros : {
			"dC" : "{\\mathbb{C}}",
			"dN" : "{\\mathbb{N}}",
			"dR" : "{\\mathbb{R}}",
			"dZ" : "{\\mathbb{Z}}",
			"cB" : "{\\mathcal{B}}",
			"cC" : "{\\mathcal{C}}",
			"cL" : "{\\mathcal{L}}",
			"cM" : "{\\mathcal{M}}",
			"cS" : "{\\mathcal{S}}",
			"Ker" : "{\\mathop{Ker}}",
			"Im" : "{\\mathop{Im}}",
			"re" : "{\\mathfrak{Re}}",
			"im" : "{\\mathfrak{Im}}",
			"syst" : ["\\left\\{\\begin{aligned}#1\\end{aligned}\\right.", 1],
			"vect" : "{\\mathop{vect}}",
			"la" : "{\\lambda}",
			"te" : "{\\theta}",
			"trans" : ["{}^t#1", 1],
			"tr" : "{\\mathop{Tr}}",
			"O" : "{\\mathrm{O}}",
			"rg" : "{\\mathrm{rg}}",
			"sp" : "{\\mathrm{sp}}",
			"iddots" : "{\\kern3mu\\raise1mu{.}\\kern3mu\\raise6mu{.}\\kern3mu\\raise12mu{.}}",
			"al" : "{\\alpha}"
		}

	}
});

MathJax.Hub.Register.StartupHook("TeX Jax Ready", function() {
	var TEX = MathJax.InputJax.TeX;
	var PREFILTER = TEX.prefilterMath;
	TEX.Augment({
		prefilterMath : function(math, displaymode, script) {
			math = "\\displaystyle{" + math + "}";
			return PREFILTER.call(TEX, math, displaymode, script);
		}
	});
});

$('#save').click(function() {
	$('#saveModal').modal('hide');
});

function Item() {
	var self = this;
	self.niveau = ko.observable();
	self.niveaux = ko.observableArray(["Première année", "Deuxième année"]);
	self.themes = ko.observableArray();
	self.selectedThemes = ko.observableArray();
	self.enonce = ko.observable();
	self.reponses = ko.observableArray();

	for (var i = 0; i < 4; i++) {
		self.reponses.push({
			reponse : ko.observable(),
			value : ko.observable()
		});
	};

	$.getJSON('../themes.php', function(themes) {
		$.each(themes, function(key, val) {
			self.themes.push(ko.observable(val[0]));
		});
	});

	self.htmlentities = function(s) {
		if (s) {
			return s.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br />')
		} else {
			return s
		}
	};

	self.mathjax = function(data, event) {
		MathJax.Hub.Queue(["Typeset", MathJax.Hub, $(event.target).next().get(0)]);
	};

	self.save = function() {
		alert(JSON.stringify({
			niveau : self.niveau(),
			themes : self.selectedThemes(),
			enonce : self.htmlentities(self.enonce()),
			reponses : $.map(self.reponses(), function(r) {
				return {
					reponse : self.htmlentities(r.reponse()),
					value : r.value()
				}
			})
		}));
	};
}

var item = new Item();
ko.applyBindings(item);
