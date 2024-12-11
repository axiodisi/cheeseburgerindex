<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Funnel -->
  <path d="M100,50 L300,50 L250,200 L150,200 Z" fill="#555" stroke="#333" stroke-width="2"/>
  <path d="M150,200 L250,200 L200,350 L200,350 Z" fill="#444" stroke="#333" stroke-width="2"/>
  
  <!-- Falling Ingredients Animation -->
  <g>
    <!-- Lettuce -->
    <path>
      <animate attributeName="d"
        dur="3s"
        repeatCount="indefinite"
        values="M50,0 Q75,-10 100,0 T150,0 T200,0;
                M125,175 Q150,165 175,175 T225,175 T275,175"
        fill="freeze"/>
      <animate attributeName="fill"
        dur="3s"
        repeatCount="indefinite"
        values="#90EE90;#90EE90"/>
    </path>
    
    <!-- Cow -->
    <path d="M30,10 L50,10 L45,20 L35,20 Z">
      <animate attributeName="transform"
        attributeType="XML"
        type="translate"
        from="0 -30"
        to="150 200"
        dur="2s"
        repeatCount="indefinite"/>
      <animate attributeName="fill"
        values="#8B4513;#8B4513"
        dur="2s"
        repeatCount="indefinite"/>
    </path>
    
    <!-- Burger Output -->
    <g transform="translate(180,350)">
      <circle r="15" fill="#F4A460"/>
      <rect x="-12" y="-2" width="24" height="4" fill="#90EE90"/>
      <circle r="12" cy="2" fill="#F4A460"/>
      <animate attributeName="opacity"
        values="0;1;0"
        dur="2s"
        repeatCount="indefinite"/>
    </g>
  </g>
</svg>