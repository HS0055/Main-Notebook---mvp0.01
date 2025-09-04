import { db } from '@/db';
import { pages } from '@/db/schema';

async function main() {
    const samplePages = [
        // Advanced Calculus notebook (id: 1)
        {
            notebookId: 1,
            title: 'Derivatives and Limits',
            leftContent: 'Definition of Limits:\n\nThe limit of a function f(x) as x approaches a value c is:\n\nlim(x→c) f(x) = L\n\nThis means that as x gets arbitrarily close to c, f(x) gets arbitrarily close to L.\n\nFormal Definition (ε-δ):\nFor every ε > 0, there exists δ > 0 such that if 0 < |x - c| < δ, then |f(x) - L| < ε.\n\nCommon Limit Properties:\n• lim(x→c) [f(x) + g(x)] = lim(x→c) f(x) + lim(x→c) g(x)\n• lim(x→c) [f(x) · g(x)] = lim(x→c) f(x) · lim(x→c) g(x)\n• lim(x→c) [f(x)/g(x)] = lim(x→c) f(x) / lim(x→c) g(x), provided lim(x→c) g(x) ≠ 0',
            rightContent: 'Derivative Rules:\n\nThe derivative of f(x) at point x is:\nf\'(x) = lim(h→0) [f(x+h) - f(x)]/h\n\nBasic Derivative Rules:\n1. Power Rule: d/dx[x^n] = nx^(n-1)\n2. Constant Rule: d/dx[c] = 0\n3. Sum Rule: d/dx[f(x) + g(x)] = f\'(x) + g\'(x)\n4. Product Rule: d/dx[f(x)g(x)] = f\'(x)g(x) + f(x)g\'(x)\n5. Quotient Rule: d/dx[f(x)/g(x)] = [f\'(x)g(x) - f(x)g\'(x)]/[g(x)]²\n6. Chain Rule: d/dx[f(g(x))] = f\'(g(x)) · g\'(x)\n\nTrigonometric Derivatives:\n• d/dx[sin(x)] = cos(x)\n• d/dx[cos(x)] = -sin(x)\n• d/dx[tan(x)] = sec²(x)',
            pageOrder: 1,
            createdAt: new Date('2024-01-10').toISOString(),
            updatedAt: new Date('2024-01-10').toISOString(),
        },
        {
            notebookId: 1,
            title: 'Integration Techniques',
            leftContent: 'Integration by Parts:\n\nFormula: ∫u dv = uv - ∫v du\n\nSteps:\n1. Choose u and dv from the integrand\n2. Find du = u\' dx and v = ∫dv\n3. Apply the formula\n4. Evaluate the remaining integral\n\nLIATE Rule for choosing u:\nL - Logarithmic functions\nI - Inverse trigonometric functions\nA - Algebraic functions\nT - Trigonometric functions\nE - Exponential functions\n\nExample: ∫x e^x dx\nLet u = x, dv = e^x dx\nThen du = dx, v = e^x\n∫x e^x dx = x e^x - ∫e^x dx = x e^x - e^x + C',
            rightContent: 'Substitution Method:\n\nAlso known as u-substitution or change of variables.\n\nSteps:\n1. Identify a portion of the integrand as u\n2. Find du = u\' dx\n3. Rewrite the integral in terms of u\n4. Integrate with respect to u\n5. Substitute back to original variable\n\nExample: ∫2x(x² + 1)³ dx\nLet u = x² + 1\nThen du = 2x dx\n∫2x(x² + 1)³ dx = ∫u³ du = u⁴/4 + C = (x² + 1)⁴/4 + C\n\nTrigonometric Substitution:\n• For √(a² - x²), use x = a sin θ\n• For √(a² + x²), use x = a tan θ\n• For √(x² - a²), use x = a sec θ',
            pageOrder: 2,
            createdAt: new Date('2024-01-11').toISOString(),
            updatedAt: new Date('2024-01-11').toISOString(),
        },
        {
            notebookId: 1,
            title: 'Multivariable Calculus',
            leftContent: 'Partial Derivatives:\n\nFor a function f(x,y), partial derivatives are:\n∂f/∂x = lim(h→0) [f(x+h,y) - f(x,y)]/h\n∂f/∂y = lim(h→0) [f(x,y+h) - f(x,y)]/h\n\nNotation:\n• ∂f/∂x = f_x = f₁\n• ∂f/∂y = f_y = f₂\n\nRules:\n• Treat other variables as constants\n• All single-variable derivative rules apply\n\nSecond-Order Partial Derivatives:\n• f_xx = ∂²f/∂x²\n• f_yy = ∂²f/∂y²\n• f_xy = f_yx = ∂²f/∂x∂y (mixed partials)\n\nClairaut\'s Theorem: If f_xy and f_yx are continuous, then f_xy = f_yx',
            rightContent: 'Double Integrals:\n\nDouble integral over rectangle R = [a,b] × [c,d]:\n∬_R f(x,y) dA = ∫ᶜᵈ ∫ᵃᵇ f(x,y) dx dy\n\nFubini\'s Theorem:\nIf f is continuous on R, then:\n∬_R f(x,y) dA = ∫ᶜᵈ [∫ᵃᵇ f(x,y) dx] dy = ∫ᵃᵇ [∫ᶜᵈ f(x,y) dy] dx\n\nType I Region: {(x,y) | a ≤ x ≤ b, g₁(x) ≤ y ≤ g₂(x)}\n∬_D f(x,y) dA = ∫ᵃᵇ ∫ᵍ¹⁽ˣ⁾ᵍ²⁽ˣ⁾ f(x,y) dy dx\n\nType II Region: {(x,y) | c ≤ y ≤ d, h₁(y) ≤ x ≤ h₂(y)}\n∬_D f(x,y) dA = ∫ᶜᵈ ∫ʰ¹⁽ʸ⁾ʰ²⁽ʸ⁾ f(x,y) dx dy\n\nApplications:\n• Volume under surface\n• Average value of function\n• Mass and center of mass',
            pageOrder: 3,
            createdAt: new Date('2024-01-12').toISOString(),
            updatedAt: new Date('2024-01-12').toISOString(),
        },

        // Organic Chemistry notebook (id: 2)
        {
            notebookId: 2,
            title: 'Alkanes and Alkenes',
            leftContent: 'Structure and Properties:\n\nAlkanes (Saturated Hydrocarbons):\n• General formula: CₙH₂ₙ₊₂\n• Single C-C bonds only\n• Tetrahedral geometry (sp³ hybridization)\n• Examples: methane (CH₄), ethane (C₂H₆), propane (C₃H₈)\n\nPhysical Properties:\n• Boiling points increase with molecular weight\n• Branching decreases boiling point\n• Nonpolar molecules (London dispersion forces)\n• Insoluble in water, soluble in nonpolar solvents\n\nAlkenes (Unsaturated Hydrocarbons):\n• General formula: CₙH₂ₙ\n• One C=C double bond\n• Trigonal planar geometry (sp² hybridization)\n• Examples: ethene (C₂H₄), propene (C₃H₆)\n• Can exhibit geometric isomerism (cis/trans)',
            rightContent: 'Reaction Mechanisms:\n\nAlkane Reactions:\n1. Combustion: CₙH₂ₙ₊₂ + O₂ → CO₂ + H₂O + energy\n2. Halogenation (Free Radical):\n   • Initiation: X₂ → 2X• (light/heat)\n   • Propagation: R-H + X• → R• + HX\n                  R• + X₂ → R-X + X•\n   • Termination: X• + X• → X₂\n\nAlkene Reactions:\n1. Addition Reactions:\n   • Hydrogenation: C=C + H₂ → C-C (Pt catalyst)\n   • Halogenation: C=C + X₂ → C(X)-C(X)\n   • Hydrohalogenation: C=C + HX → C(H)-C(X)\n   \n2. Markovnikov\'s Rule:\n   In addition of HX to alkenes, H adds to carbon with more H atoms\n   \n3. Oxidation:\n   • Mild: KMnO₄ → diols\n   • Strong: KMnO₄/heat → carboxylic acids/ketones',
            pageOrder: 1,
            createdAt: new Date('2024-01-13').toISOString(),
            updatedAt: new Date('2024-01-13').toISOString(),
        },
        {
            notebookId: 2,
            title: 'Functional Groups',
            leftContent: 'Classification:\n\nMajor Functional Groups:\n\n1. Alcohols (-OH)\n   • Primary (1°): R-CH₂OH\n   • Secondary (2°): R₂CHOH\n   • Tertiary (3°): R₃COH\n\n2. Aldehydes (-CHO)\n   • Terminal carbonyl group\n   • Example: acetaldehyde (CH₃CHO)\n\n3. Ketones (C=O)\n   • Internal carbonyl group\n   • Example: acetone (CH₃COCH₃)\n\n4. Carboxylic Acids (-COOH)\n   • Combination of carbonyl and hydroxyl\n   • Example: acetic acid (CH₃COOH)\n\n5. Esters (-COO-)\n   • Derived from carboxylic acids\n   • Example: methyl acetate (CH₃COOCH₃)\n\n6. Amines (-NH₂, -NHR, -NR₂)\n   • Primary, secondary, tertiary amines',
            rightContent: 'Naming Conventions:\n\nIUPAC Nomenclature Rules:\n\n1. Find longest carbon chain\n2. Number to give functional group lowest number\n3. Name substituents and their positions\n4. Use appropriate suffix for functional group\n\nFunctional Group Priority (highest to lowest):\nCarboxylic acid (-oic acid) > Ester (-oate) > Amide (-amide) > Aldehyde (-al) > Ketone (-one) > Alcohol (-ol) > Amine (-amine)\n\nCommon Prefixes:\nmeth- (1C), eth- (2C), prop- (3C), but- (4C), pent- (5C), hex- (6C)\n\nExamples:\n• CH₃CH₂OH: ethanol\n• CH₃CH₂CHO: propanal\n• CH₃COCH₃: propanone (acetone)\n• CH₃CH₂COOH: propanoic acid\n• CH₃COOCH₂CH₃: ethyl ethanoate\n\nSubstituent Names:\n• Halides: fluoro-, chloro-, bromo-, iodo-\n• Alkyl groups: methyl-, ethyl-, propyl-',
            pageOrder: 2,
            createdAt: new Date('2024-01-14').toISOString(),
            updatedAt: new Date('2024-01-14').toISOString(),
        },
        {
            notebookId: 2,
            title: 'Stereochemistry',
            leftContent: 'Chirality Concepts:\n\nChirality:\n• A molecule is chiral if it cannot be superimposed on its mirror image\n• Contains at least one chiral center (carbon with 4 different groups)\n• Chiral molecules rotate plane-polarized light\n\nEnantiomers:\n• Non-superimposable mirror images\n• Same physical properties except optical rotation\n• Different biological activities often observed\n• Racemic mixture: 50:50 mixture of enantiomers\n\nDiastereomers:\n• Stereoisomers that are not mirror images\n• Different physical and chemical properties\n• Can be separated by normal techniques\n\nMeso Compounds:\n• Molecules with chiral centers but overall achiral\n• Contain internal plane of symmetry\n• Do not rotate plane-polarized light',
            rightContent: 'R/S Configuration:\n\nCahn-Ingold-Prelog Rules:\n\n1. Assign priority to groups attached to chiral center:\n   • Higher atomic number = higher priority\n   • If tied, look at next atoms\n   • Multiple bonds count as multiple single bonds\n\n2. Arrange molecule so lowest priority group points away\n\n3. Trace path from 1→2→3 (highest to lowest priority):\n   • Clockwise = R (rectus)\n   • Counterclockwise = S (sinister)\n\nPriority Examples:\n• I > Br > Cl > F\n• -COOH > -CHO > -CH₂OH > -CH₃\n• -C≡N > -C=O > -CH=CH₂ > -CH₂CH₃\n\nFischer Projections:\n• Horizontal lines = bonds coming toward viewer\n• Vertical lines = bonds going away from viewer\n• Cross represents chiral carbon\n\nOptical Activity:\n[α] = α/(l×c) where α = observed rotation, l = path length, c = concentration',
            pageOrder: 3,
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-01-15').toISOString(),
        },

        // World History notebook (id: 3)
        {
            notebookId: 3,
            title: 'Ancient Civilizations',
            leftContent: 'Mesopotamia and Egypt:\n\nMesopotamia (3500-500 BCE):\n• "Land between rivers" (Tigris and Euphrates)\n• First urban civilization\n• Sumerians invented writing (cuneiform), wheel, plow\n• Code of Hammurabi (1750 BCE) - first written laws\n• Ziggurats - temple complexes\n• City-states: Ur, Babylon, Assyria\n• Innovations: mathematics, astronomy, calendar\n\nAncient Egypt (3100-30 BCE):\n• United under Pharaoh Menes (3100 BCE)\n• Three kingdoms: Old, Middle, New\n• Nile River - "gift of the Nile"\n• Hieroglyphic writing system\n• Pyramids of Giza (Old Kingdom)\n• Mummification and afterlife beliefs\n• Social hierarchy: Pharaoh, priests, nobles, scribes, farmers, slaves\n• Notable rulers: Hatshepsut, Akhenaten, Tutankhamun, Cleopatra VII',
            rightContent: 'Greece and Rome:\n\nAncient Greece (800-146 BCE):\n• City-states (polis): Athens, Sparta, Thebes\n• Athens: birthplace of democracy (508 BCE)\n• Sparta: military society\n• Persian Wars (499-449 BCE)\n• Golden Age of Athens (461-429 BCE)\n• Philosophy: Socrates, Plato, Aristotle\n• Arts: drama, sculpture, architecture\n• Alexander the Great (336-323 BCE) - Hellenistic period\n\nRoman Empire (753 BCE-476/1453 CE):\n• Roman Republic (509-27 BCE)\n• Punic Wars vs. Carthage (264-146 BCE)\n• Julius Caesar and end of Republic (49-44 BCE)\n• Augustus - first emperor (27 BCE)\n• Pax Romana (27 BCE-180 CE)\n• Roman law and engineering\n• Christianity becomes official religion (380 CE)\n• Fall of Western Rome (476 CE), Eastern (Byzantine) continues',
            pageOrder: 1,
            createdAt: new Date('2024-01-16').toISOString(),
            updatedAt: new Date('2024-01-16').toISOString(),
        },
        {
            notebookId: 3,
            title: 'Medieval Period',
            leftContent: 'Feudal System:\n\nStructure (9th-15th centuries):\n• Hierarchical system based on land ownership\n• King grants land (fiefs) to nobles (vassals)\n• Nobles provide military service to king\n• Peasants (serfs) work land, bound to manor\n\nFeudal Hierarchy:\n1. King - owns all land\n2. Lords/Nobles - receive fiefs, owe military service\n3. Knights - professional warriors, serve lords\n4. Peasants/Serfs - work land, provide labor\n\nManorialism:\n• Economic system of medieval Europe\n• Self-sufficient agricultural estates\n• Lord\'s demesne and peasant holdings\n• Three-field system of crop rotation\n• Peasants owe labor, rent, and loyalty\n\nCharlemagne\'s Empire (768-814):\n• Crowned Holy Roman Emperor (800 CE)\n• Carolingian Renaissance\n• Unified much of Western Europe',
            rightContent: 'Crusades Impact:\n\nThe Crusades (1095-1291):\n• Series of religious wars\n• Goal: recapture Holy Land from Muslims\n• Pope Urban II\'s call (1095)\n\nMajor Crusades:\n• First Crusade (1096-1099): captured Jerusalem\n• Second Crusade (1147-1149): failed\n• Third Crusade (1189-1192): Richard vs. Saladin\n• Fourth Crusade (1202-1204): sacked Constantinople\n\nLong-term Effects:\n• Increased trade between East and West\n• Introduction of new technologies and ideas\n• Growth of Italian city-states (Venice, Genoa)\n• Decline of Byzantine Empire\n• Religious intolerance and persecution\n• Banking and credit systems developed\n• Cultural exchange and learning\n• Weakening of feudal system\n• Rise of monarchical power\n• Exposure to classical Greek texts via Islamic scholars',
            pageOrder: 2,
            createdAt: new Date('2024-01-17').toISOString(),
            updatedAt: new Date('2024-01-17').toISOString(),
        },
        {
            notebookId: 3,
            title: 'Industrial Revolution',
            leftContent: 'Technological Advances:\n\nFirst Industrial Revolution (1760-1840):\n\nKey Inventions:\n• Spinning Jenny (1764) - James Hargreaves\n• Water Frame (1769) - Richard Arkwright\n• Steam Engine improvements (1769) - James Watt\n• Cotton Gin (1793) - Eli Whitney\n• Power Loom (1785) - Edmund Cartwright\n\nTransportation Revolution:\n• Canals and improved roads\n• Steam locomotives - George Stephenson (1825)\n• First passenger railway: Liverpool-Manchester (1830)\n• Steamships - regular Atlantic crossings\n\nTextile Industry:\n• Mechanization of cloth production\n• Factory system replaces cottage industry\n• Mass production and standardization\n\nIron and Coal:\n• Coke-fueled blast furnaces\n• Puddling process for wrought iron\n• Coal mining expansion',
            rightContent: 'Social Changes:\n\nUrbanization:\n• Rapid growth of industrial cities\n• Manchester, Birmingham, Liverpool\n• Poor living conditions in industrial towns\n• Overcrowding and pollution\n\nSocial Classes:\n• Industrial bourgeoisie (factory owners)\n• Industrial proletariat (factory workers)\n• Decline of traditional aristocracy\n• Growing middle class\n\nWorking Conditions:\n• Long hours (12-16 hours/day)\n• Dangerous factory conditions\n• Child labor widespread\n• Low wages and job insecurity\n• No worker protections initially\n\nLabor Movement:\n• Formation of trade unions\n• Strikes and protests\n• Luddites - destroyed machinery (1811-1816)\n• Reform movements emerge\n\nSocial Reforms:\n• Factory Act (1833) - regulated child labor\n• Ten Hours Act (1847) - limited working hours\n• Public health improvements\n• Education reforms',
            pageOrder: 3,
            createdAt: new Date('2024-01-18').toISOString(),
            updatedAt: new Date('2024-01-18').toISOString(),
        },

        // Physics notebook (id: 4)
        {
            notebookId: 4,
            title: 'Newton\'s Laws',
            leftContent: 'Three Laws Explained:\n\nFirst Law (Law of Inertia):\n"An object at rest stays at rest, and an object in motion stays in motion at constant velocity, unless acted upon by a net external force."\n\nMathematically: ΣF = 0 ⟹ a = 0\n• Inertia: tendency to resist changes in motion\n• Depends on mass - more mass = more inertia\n• Defines inertial reference frames\n\nSecond Law (F = ma):\n"The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass."\n\nΣF = ma\n• Vector equation: ΣF⃗ = ma⃗\n• Force in Newtons (N = kg⋅m/s²)\n• Acceleration in m/s²\n\nThird Law (Action-Reaction):\n"For every action, there is an equal and opposite reaction."\n\nF₁₂ = -F₂₁\n• Forces always come in pairs\n• Act on different objects\n• Equal magnitude, opposite direction',
            rightContent: 'Practical Applications:\n\nFirst Law Applications:\n• Seatbelts in cars (prevent forward motion during stops)\n• Objects sliding on frictionless surfaces\n• Satellites in orbit (no air resistance)\n• Hockey puck on ice\n\nSecond Law Applications:\n• Calculating force needed to accelerate car: F = ma\n• Elevator problems: F_normal - mg = ma\n• Inclined plane: mg sin θ = ma (frictionless)\n• Atwood machine: T - m₁g = m₁a, m₂g - T = m₂a\n\nThird Law Applications:\n• Walking: foot pushes back on ground, ground pushes forward on foot\n• Rocket propulsion: gas expelled downward, rocket pushed upward\n• Swimming: hands push water backward, water pushes swimmer forward\n• Jumping: person pushes down on ground, ground pushes up on person\n\nFree Body Diagrams:\n• Identify all forces acting on object\n• Draw arrows showing force directions\n• Apply Newton\'s laws in component form\n• ΣFₓ = maₓ, ΣFᵧ = maᵧ',
            pageOrder: 1,
            createdAt: new Date('2024-01-19').toISOString(),
            updatedAt: new Date('2024-01-19').toISOString(),
        },
        {
            notebookId: 4,
            title: 'Thermodynamics',
            leftContent: 'First and Second Law:\n\nFirst Law of Thermodynamics:\n"Energy cannot be created or destroyed, only converted from one form to another."\n\nΔU = Q - W\nwhere:\n• ΔU = change in internal energy\n• Q = heat added to system\n• W = work done by system\n\nAlternate form: ΔU = Q + W (work done on system)\n\nSign Conventions:\n• Q > 0: heat added to system\n• Q < 0: heat removed from system\n• W > 0: work done by system (expansion)\n• W < 0: work done on system (compression)\n\nSpecial Processes:\n• Isothermal: ΔT = 0, so ΔU = 0, Q = W\n• Adiabatic: Q = 0, so ΔU = -W\n• Isochoric: V constant, W = 0, so ΔU = Q\n• Isobaric: P constant, W = PΔV\n\nSecond Law of Thermodynamics:\n"Heat flows spontaneously from hot to cold objects, never the reverse without external work."\n\nEntropy always increases in isolated systems: ΔS ≥ 0',
            rightContent: 'Entropy Concepts:\n\nEntropy (S):\n• Measure of disorder or randomness\n• Statistical definition: S = k ln Ω\n  where Ω = number of microstates\n• Thermodynamic definition: dS = dQ/T (reversible)\n\nEntropy Changes:\n• Isolated system: ΔS_total ≥ 0\n• Reversible process: ΔS_total = 0\n• Irreversible process: ΔS_total > 0\n\nHeat Engines:\n• Convert heat to work\n• Efficiency: η = W/Q_h = 1 - Q_c/Q_h\n• Carnot efficiency (maximum): η_C = 1 - T_c/T_h\n• Real engines always less efficient than Carnot\n\nRefrigerators and Heat Pumps:\n• Move heat from cold to hot reservoir\n• Coefficient of Performance (COP):\n  - Refrigerator: COP_R = Q_c/W\n  - Heat pump: COP_HP = Q_h/W\n\nIrreversible Processes:\n• Free expansion of gas\n• Heat conduction\n• Friction\n• Mixing of different substances\n\nAll spontaneous processes increase total entropy',
            pageOrder: 2,
            createdAt: new Date('2024-01-20').toISOString(),
            updatedAt: new Date('2024-01-20').toISOString(),
        },

        // Computer Science notebook (id: 5)
        {
            notebookId: 5,
            title: 'Data Structures',
            leftContent: 'Arrays and Linked Lists:\n\nArrays:\n• Fixed-size sequential collection\n• Elements stored in contiguous memory\n• Zero-based indexing (usually)\n• Random access: O(1) time complexity\n• Cache-friendly due to locality\n\nArray Operations:\n• Access: arr[i] - O(1)\n• Search: O(n) unsorted, O(log n) sorted\n• Insert: O(n) - need to shift elements\n• Delete: O(n) - shift elements after deletion\n\nLinked Lists:\n• Dynamic size, nodes connected by pointers\n• Node structure: data + pointer to next\n• Sequential access only\n• Memory scattered (not cache-friendly)\n\nSingly Linked List Operations:\n• Insert at head: O(1)\n• Insert at tail: O(n) without tail pointer, O(1) with\n• Delete: O(n) to find, O(1) to remove\n• Search: O(n)\n\nDoubly Linked List:\n• Nodes have prev and next pointers\n• Bi-directional traversal\n• Easier deletion (no need to track previous)',
            rightContent: 'Trees and Graphs:\n\nBinary Trees:\n• Each node has at most 2 children\n• Root, internal nodes, leaves\n• Height: longest path from root to leaf\n• Complete tree: all levels filled except possibly last\n\nBinary Search Tree (BST):\n• Left subtree < root < right subtree\n• Search, insert, delete: O(log n) average, O(n) worst\n• In-order traversal gives sorted sequence\n\nTree Traversals:\n• Pre-order: root → left → right\n• In-order: left → root → right\n• Post-order: left → right → root\n• Level-order: breadth-first (use queue)\n\nGraphs:\n• Set of vertices (nodes) and edges\n• Directed vs undirected\n• Weighted vs unweighted\n• Connected vs disconnected\n\nGraph Representations:\n• Adjacency Matrix: O(V²) space, O(1) edge check\n• Adjacency List: O(V+E) space, O(degree) edge check\n\nGraph Algorithms:\n• DFS: O(V+E), uses stack/recursion\n• BFS: O(V+E), uses queue, shortest path in unweighted',
            pageOrder: 1,
            createdAt: new Date('2024-01-21').toISOString(),
            updatedAt: new Date('2024-01-21').toISOString(),
        },
        {
            notebookId: 5,
            title: 'Algorithms',
            leftContent: 'Sorting Algorithms:\n\nBubble Sort:\n• Compare adjacent elements, swap if wrong order\n• Time: O(n²), Space: O(1)\n• Stable, simple but inefficient\n\nSelection Sort:\n• Find minimum, swap with first element\n• Repeat for remaining elements\n• Time: O(n²), Space: O(1)\n• Unstable, fewer swaps than bubble sort\n\nInsertion Sort:\n• Build sorted portion one element at a time\n• Time: O(n²) worst, O(n) best, Space: O(1)\n• Stable, efficient for small arrays\n\nMerge Sort:\n• Divide array in half, recursively sort, merge\n• Time: O(n log n), Space: O(n)\n• Stable, consistent performance\n\nQuick Sort:\n• Choose pivot, partition around pivot, recurse\n• Time: O(n log n) average, O(n²) worst, Space: O(log n)\n• Unstable, in-place, cache-efficient\n\nHeap Sort:\n• Build max heap, repeatedly extract maximum\n• Time: O(n log n), Space: O(1)\n• Unstable, consistent performance',
            rightContent: 'Time Complexity:\n\nBig O Notation:\n• Describes upper bound of algorithm\'s growth rate\n• Focus on dominant term, ignore constants\n• Worst-case analysis (usually)\n\nCommon Time Complexities:\n• O(1) - Constant: array access, hash table lookup\n• O(log n) - Logarithmic: binary search, balanced tree\n• O(n) - Linear: linear search, traversing array\n• O(n log n) - Linearithmic: merge sort, heap sort\n• O(n²) - Quadratic: nested loops, bubble sort\n• O(2ⁿ) - Exponential: recursive fibonacci, subsets\n• O(n!) - Factorial: permutations, traveling salesman\n\nSpace Complexity:\n• Amount of memory used relative to input size\n• Includes auxiliary space (not input space)\n\nAmortized Analysis:\n• Average time per operation over sequence\n• Example: Dynamic array insertion - O(1) amortized\n\nMaster Theorem:\nFor T(n) = aT(n/b) + f(n):\n• If f(n) = O(n^c) where c < log_b(a): T(n) = O(n^(log_b(a)))\n• If f(n) = O(n^c) where c = log_b(a): T(n) = O(n^c log n)\n• If f(n) = O(n^c) where c > log_b(a): T(n) = O(f(n))',
            pageOrder: 2,
            createdAt: new Date('2024-01-22').toISOString(),
            updatedAt: new Date('2024-01-22').toISOString(),
        },

        // Biology notebook (id: 6)
        {
            notebookId: 6,
            title: 'Cell Biology',
            leftContent: 'Cell Structure:\n\nProkaryotic Cells (Bacteria, Archaea):\n• No membrane-bound nucleus\n• Genetic material in nucleoid region\n• Simple internal structure\n• Cell wall (peptidoglycan in bacteria)\n• Ribosomes (70S)\n• Some have flagella for movement\n\nEukaryotic Cells (Plants, Animals, Fungi, Protists):\n• Membrane-bound nucleus\n• Complex organelles\n• Larger than prokaryotes\n• Linear chromosomes\n\nCell Membrane:\n• Phospholipid bilayer\n• Fluid mosaic model\n• Selective permeability\n• Proteins: integral, peripheral, transmembrane\n• Cholesterol maintains fluidity\n\nOrganelles:\n• Nucleus: DNA storage, transcription\n• Mitochondria: ATP production, cellular respiration\n• ER: protein synthesis (rough), lipid synthesis (smooth)\n• Golgi apparatus: protein modification, packaging\n• Ribosomes: protein synthesis\n• Lysosomes: digestion, waste removal\n• Vacuoles: storage (large in plants)\n• Chloroplasts: photosynthesis (plants only)',
            rightContent: 'Cellular Processes:\n\nCellular Respiration:\nC₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP\n\nStages:\n1. Glycolysis (cytoplasm): glucose → 2 pyruvate, 2 ATP, 2 NADH\n2. Krebs Cycle (mitochondrial matrix): pyruvate oxidation, 2 ATP, 6 NADH, 2 FADH₂\n3. Electron Transport Chain (inner mitochondrial membrane): 32-34 ATP\n\nTotal yield: ~36-38 ATP per glucose\n\nPhotosynthesis:\n6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂\n\nStages:\n1. Light Reactions (thylakoids): light → ATP + NADPH + O₂\n2. Calvin Cycle (stroma): CO₂ + ATP + NADPH → glucose\n\nCell Transport:\n• Passive: diffusion, osmosis, facilitated diffusion\n• Active: requires energy, against concentration gradient\n• Endocytosis: cell engulfs material\n• Exocytosis: cell releases material\n\nCell Division:\n• Mitosis: somatic cell division (diploid → 2 diploid)\n• Meiosis: gamete formation (diploid → 4 haploid)',
            pageOrder: 1,
            createdAt: new Date('2024-01-23').toISOString(),
            updatedAt: new Date('2024-01-23').toISOString(),
        },
        {
            notebookId: 6,
            title: 'Genetics',
            leftContent: 'DNA Structure:\n\nDNA (Deoxyribonucleic Acid):\n• Double helix structure (Watson-Crick model)\n• Antiparallel strands (5\' to 3\' direction)\n• Sugar-phosphate backbone\n• Nitrogenous bases: A, T, G, C\n• Base pairing: A-T (2 H bonds), G-C (3 H bonds)\n• Chargaff\'s rules: A=T, G=C\n\nDNA Components:\n• Nucleotide = phosphate + sugar (deoxyribose) + base\n• Purines: Adenine (A), Guanine (G) - double ring\n• Pyrimidines: Thymine (T), Cytosine (C) - single ring\n\nDNA Replication:\n• Semi-conservative model\n• Occurs during S phase of cell cycle\n• Helicase unwinds double helix\n• DNA polymerase adds nucleotides (5\' to 3\')\n• Leading strand: continuous synthesis\n• Lagging strand: discontinuous (Okazaki fragments)\n• Primase adds RNA primers\n• Ligase joins DNA fragments\n\nChromosome Structure:\n• DNA + histones = chromatin\n• Condensed during cell division\n• Humans: 46 chromosomes (23 pairs)',
            rightContent: 'Gene Expression:\n\nCentral Dogma:\nDNA → RNA → Protein\n\nTranscription (DNA → RNA):\n• Occurs in nucleus (eukaryotes)\n• RNA polymerase reads DNA template (3\' to 5\')\n• Synthesizes mRNA (5\' to 3\')\n• Promoter region initiates transcription\n• Termination signals end transcription\n• In eukaryotes: mRNA processing (5\' cap, 3\' poly-A tail, splicing)\n\nGenetic Code:\n• Triplet code: 3 nucleotides = 1 codon = 1 amino acid\n• 64 codons, 20 amino acids\n• Redundant: multiple codons for same amino acid\n• Universal: same code in all organisms\n• Start codon: AUG (methionine)\n• Stop codons: UAA, UAG, UGA\n\nTranslation (RNA → Protein):\n• Occurs at ribosomes\n• tRNA brings amino acids to ribosome\n• Anticodon-codon pairing\n• Peptide bonds form between amino acids\n• Process: initiation → elongation → termination\n\nGene Regulation:\n• Prokaryotes: operons (lac operon, trp operon)\n• Eukaryotes: transcription factors, enhancers, silencers',
            pageOrder: 2,
            createdAt: new Date('2024-01-24').toISOString(),
            updatedAt: new Date('2024-01-24').toISOString(),
        },
    ];

    await db.insert(pages).values(samplePages);
    
    console.log('✅ Pages seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});