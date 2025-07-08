# SayHi App: Implementation Guide for Remaining Screens

## 🎯 How to Apply the Refactoring Pattern

This guide shows developers how to apply the same architectural improvements demonstrated in the FriendScreen refactor to the remaining screens (ChatScreen, PickScreen, ProfileScreen).

## 📋 Step-by-Step Refactoring Process

### Phase 1: Analyze Current Implementation
1. **Identify Mixed Concerns**: Look for API calls, business logic, and UI rendering mixed together
2. **Find Performance Issues**: Look for manual array generation, missing FlatList usage, unnecessary re-renders
3. **Spot Reusable Patterns**: Identify repeated UI patterns that can become components
4. **Check Accessibility**: Note missing labels, touch targets, and proper roles

### Phase 2: Extract Business Logic
1. **Create Custom Hook**: Move all data fetching and state management to a custom hook
2. **Centralize Error Handling**: Create consistent error states and user feedback
3. **Add Loading States**: Implement proper loading, refreshing, and error states
4. **Optimize Data Flow**: Use useCallback and useMemo for performance

### Phase 3: Decompose UI Components
1. **Create Atomic Components**: Start with basic building blocks (buttons, text, inputs)
2. **Build Molecular Components**: Combine atoms into functional units (list items, cards, forms)
3. **Construct Organism Components**: Create complex UI sections (lists, forms, layouts)
4. **Apply Design System**: Use consistent theming, spacing, and typography

### Phase 4: Optimize Performance
1. **Implement FlatList**: Replace manual list generation with optimized FlatList
2. **Add Memoization**: Use React.memo for components and useCallback for functions
3. **Virtualization**: Configure proper FlatList optimization props
4. **Reduce Bundle Size**: Remove unused imports and optimize component structure

## 🔧 ChatScreen Refactoring Plan

### Current Issues Analysis
```javascript
// Current ChatScreen problems:
1. Manual message list generation (performance killer)
2. Mixed API calls in multiple useEffect hooks
3. Inline message bubble styling
4. No message virtualization for long conversations
5. Complex state management for real-time updates
```

### Proposed Architecture
```javascript
// 1. Custom Hook: useChat.js
function useChat(receiverId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const sendMessage = useCallback(async (text) => {
    setSending(true);
    try {
      const result = await sendMessageAPI(text, receiverId);
      if (result.success) {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text,
          sender: 'me',
          timestamp: new Date().getTime()
        }]);
      }
    } catch (error) {
      // Handle error
    } finally {
      setSending(false);
    }
  }, [receiverId]);

  const loadMessages = useCallback(async () => {
    // Load message history logic
  }, [receiverId]);

  return { messages, loading, sending, sendMessage, loadMessages };
}

// 2. Component: MessageBubble.js
function MessageBubble({ message, isOwn, userAvatar }) {
  return (
    <View style={[styles.container, isOwn ? styles.ownMessage : styles.otherMessage]}>
      {!isOwn && (
        <Avatar source={userAvatar} size="sm" style={styles.avatar} />
      )}
      <View style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
        <Typography variant="body2" color={isOwn ? "inverse" : "primary"}>
          {message.text}
        </Typography>
      </View>
      {isOwn && (
        <Avatar source={userAvatar} size="sm" style={styles.avatar} />
      )}
    </View>
  );
}

// 3. Component: MessageList.js
function MessageList({ messages, loading, onLoadMore }) {
  const renderMessage = useCallback(({ item }) => (
    <MessageBubble
      message={item}
      isOwn={item.sender === 'me'}
      userAvatar={item.sender === 'me' ? myAvatar : friendAvatar}
    />
  ), [myAvatar, friendAvatar]);

  return (
    <FlatList
      data={messages}
      renderItem={renderMessage}
      keyExtractor={(item) => `message_${item.id}`}
      onEndReached={onLoadMore}
      inverted // Messages from bottom to top
      removeClippedSubviews={true}
      maxToRenderPerBatch={20}
      windowSize={10}
    />
  );
}

// 4. Component: ChatInput.js
function ChatInput({ onSend, sending, placeholder = "Type a message..." }) {
  const [text, setText] = useState('');
  
  const handleSend = useCallback(() => {
    if (text.trim() && !sending) {
      onSend(text.trim());
      setText('');
    }
  }, [text, sending, onSend]);

  return (
    <View style={styles.container}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        style={styles.input}
        multiline
        accessibilityLabel="Message input"
      />
      <TouchableArea
        onPress={handleSend}
        disabled={!text.trim() || sending}
        accessibilityLabel="Send message"
        style={styles.sendButton}
      >
        <Icon name={sending ? "loading" : "send"} />
      </TouchableArea>
    </View>
  );
}

// 5. Refactored ChatScreen.js (simplified)
function ChatScreen({ navigation, route }) {
  const { userid } = route.params;
  const { messages, loading, sending, sendMessage } = useChat(userid);
  
  return (
    <Background style={styles.container}>
      <MessageList
        messages={messages}
        loading={loading}
        style={styles.messageList}
      />
      <ChatInput
        onSend={sendMessage}
        sending={sending}
        style={styles.chatInput}
      />
    </Background>
  );
}
```

## 🔧 PickScreen Refactoring Plan

### Current Issues Analysis
```javascript
// Current PickScreen problems:
1. Inline user card styling (not reusable)
2. Mixed discovery logic with UI
3. No empty states or error handling
4. Basic skip/chat button functionality
5. No loading states between picks
```

### Proposed Architecture
```javascript
// 1. Custom Hook: useDiscovery.js
function useDiscovery() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pickNextUser = useCallback(async () => {
    setLoading(true);
    try {
      const user = await randomPickUpExceptMe();
      setCurrentUser(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const skipUser = useCallback(() => {
    pickNextUser();
  }, [pickNextUser]);

  return { currentUser, loading, error, skipUser, pickNextUser };
}

// 2. Component: UserDiscoveryCard.js
function UserDiscoveryCard({ user, onSkip, onChat, loading }) {
  if (!user) return null;

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <Avatar
          source={user.avatar}
          size="xxl"
          style={styles.avatar}
          accessibilityLabel={`${user.displayName}'s profile picture`}
        />
        
        <Typography variant="h2" center style={styles.name}>
          {user.realname || user.username || 'Unknown'}
        </Typography>
        
        <UserInfoDisplay user={user} />
      </Card.Content>
      
      <Card.Actions style={styles.actions}>
        <Button
          mode="outlined"
          onPress={onSkip}
          disabled={loading}
          style={styles.skipButton}
          accessibilityLabel="Skip this person"
        >
          Skip
        </Button>
        
        <Button
          mode="contained"
          onPress={() => onChat(user)}
          disabled={loading}
          style={styles.chatButton}
          accessibilityLabel={`Start chatting with ${user.displayName}`}
        >
          Chat
        </Button>
      </Card.Actions>
    </Card>
  );
}

// 3. Component: UserInfoDisplay.js
function UserInfoDisplay({ user }) {
  return (
    <View style={styles.container}>
      <Typography variant="h3" style={styles.sectionTitle}>
        About
      </Typography>
      
      <InfoItem
        label="Gender"
        value={user.gender || 'Not specified'}
        icon="person"
      />
      
      <InfoItem
        label="Age"
        value={user.age ? `${user.age} years old` : 'Not specified'}
        icon="calendar"
      />
      
      <InfoItem
        label="Email"
        value={user.email || 'Not shared'}
        icon="email"
      />
    </View>
  );
}

// 4. Refactored PickScreen.js
function PickScreen({ navigation }) {
  const { currentUser, loading, error, skipUser, pickNextUser } = useDiscovery();

  const handleChat = useCallback((user) => {
    navigation.navigate('ChatScreen', { userid: user.userid });
  }, [navigation]);

  if (error) {
    return (
      <Background position="containerCenter">
        <EmptyState
          title="Connection Error"
          description={error}
          actionText="Try Again"
          onAction={pickNextUser}
        />
        <TabNavigation navigation={navigation} tabs={tabs} active="PickScreen" />
      </Background>
    );
  }

  return (
    <Background position="containerCenterWithTab">
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <UserDiscoveryCard
          user={currentUser}
          onSkip={skipUser}
          onChat={handleChat}
          loading={loading}
        />
      )}
      
      <TabNavigation navigation={navigation} tabs={tabs} active="PickScreen" />
    </Background>
  );
}
```

## 🔧 ProfileScreen Refactoring Plan

### Current Issues Analysis
```javascript
// Current ProfileScreen problems:
1. Form fields scattered throughout component
2. Mixed validation logic with UI
3. No proper form state management
4. Repetitive field styling
5. Manual state updates for each field
```

### Proposed Architecture
```javascript
// 1. Custom Hook: useProfile.js
function useProfile() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const updateField = useCallback((field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (emailValidator(profile.email)) {
      newErrors.email = emailValidator(profile.email);
    }
    
    if (usernameValidator(profile.username)) {
      newErrors.username = usernameValidator(profile.username);
    }
    
    // ... other validations
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [profile]);

  const saveProfile = useCallback(async () => {
    if (!validateForm()) return false;
    
    setSaving(true);
    try {
      const result = await updateProfile(profile);
      return result.success;
    } catch (error) {
      throw error;
    } finally {
      setSaving(false);
    }
  }, [profile, validateForm]);

  return {
    profile,
    loading,
    saving,
    errors,
    updateField,
    saveProfile,
    loadProfile
  };
}

// 2. Component: FormField.js
function FormField({
  label,
  value,
  onChangeText,
  error,
  multiline = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  ...props
}) {
  return (
    <View style={styles.container}>
      <Typography variant="body2" color="secondary" style={styles.label}>
        {label}
      </Typography>
      
      <TextInput
        value={value}
        onChangeText={onChangeText}
        error={!!error}
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={[
          styles.input,
          error && styles.inputError,
          multiline && styles.multilineInput
        ]}
        accessibilityLabel={label}
        accessibilityHint={error ? `Error: ${error}` : undefined}
        {...props}
      />
      
      {error && (
        <Typography variant="caption" color="error" style={styles.errorText}>
          {error}
        </Typography>
      )}
    </View>
  );
}

// 3. Component: ProfileForm.js
function ProfileForm({ profile, errors, onFieldChange, loading }) {
  return (
    <View style={styles.container}>
      <FormField
        label="Username"
        value={profile.username}
        onChangeText={(text) => onFieldChange('username', text)}
        error={errors.username}
        autoCapitalize="none"
      />
      
      <FormField
        label="Real Name"
        value={profile.realname}
        onChangeText={(text) => onFieldChange('realname', text)}
        error={errors.realname}
      />
      
      <FormField
        label="Email"
        value={profile.email}
        onChangeText={(text) => onFieldChange('email', text)}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <FormField
        label="Gender"
        value={profile.gender}
        onChangeText={(text) => onFieldChange('gender', text)}
        error={errors.gender}
      />
      
      <FormField
        label="Age"
        value={profile.age}
        onChangeText={(text) => onFieldChange('age', text)}
        error={errors.age}
        keyboardType="numeric"
      />
    </View>
  );
}

// 4. Refactored ProfileScreen.js
function ProfileScreen({ navigation }) {
  const {
    profile,
    loading,
    saving,
    errors,
    updateField,
    saveProfile
  } = useProfile();

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = useCallback(async () => {
    try {
      const success = await saveProfile();
      if (success) {
        setShowSuccess(true);
      }
    } catch (error) {
      // Handle error
    }
  }, [saveProfile]);

  const handleLogout = useCallback(async () => {
    await saveData('userid', '');
    await secureSave('token', '');
    navigation.navigate('HomeScreen');
  }, [navigation]);

  return (
    <Background>
      <View style={styles.header}>
        <Avatar
          source={profile.avatar}
          size="xl"
          style={styles.avatar}
        />
        <Typography variant="h2">{profile.username}</Typography>
      </View>

      <ProfileForm
        profile={profile}
        errors={errors}
        onFieldChange={updateField}
        loading={loading}
      />

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={handleSave}
          loading={saving}
          disabled={loading}
          style={styles.saveButton}
        >
          Update Profile
        </Button>
        
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          Logout
        </Button>
      </View>

      <TabNavigation navigation={navigation} tabs={tabs} active="ProfileScreen" />
    </Background>
  );
}
```

## 🚀 Migration Strategy

### Phase 1: Setup Foundation (Week 1)
1. ✅ Create enhanced theme system
2. ✅ Build atomic components (Typography, Avatar, TouchableArea)
3. ✅ Set up component directory structure
4. ✅ Create basic design tokens

### Phase 2: Proof of Concept (Week 1)
1. ✅ Refactor FriendScreen completely
2. ✅ Create molecular components (ChatListItem, EmptyState)
3. ✅ Build organism components (FriendsList)
4. ✅ Implement custom hooks (useFriends)

### Phase 3: Apply Pattern (Week 2)
1. 🔄 Refactor ChatScreen using MessageList, MessageBubble, ChatInput
2. 🔄 Refactor PickScreen using UserDiscoveryCard, UserInfoDisplay
3. 🔄 Refactor ProfileScreen using ProfileForm, FormField
4. 🔄 Update all screens to use new design system

### Phase 4: Optimization (Week 3)
1. 🔄 Performance audit and optimization
2. 🔄 Accessibility compliance check
3. 🔄 Code review and cleanup
4. 🔄 Documentation completion

## 📏 Quality Checklist

For each refactored screen, ensure:

### Architecture
- [ ] Data logic separated into custom hooks
- [ ] UI decomposed into reusable components
- [ ] No API calls in screen components
- [ ] Proper error handling and loading states

### Performance
- [ ] FlatList for any lists > 10 items
- [ ] React.memo for expensive components
- [ ] useCallback for event handlers
- [ ] Proper key extraction and item layout

### Design System
- [ ] All spacing uses theme tokens
- [ ] Typography follows design system
- [ ] Colors from theme palette
- [ ] Consistent component patterns

### Accessibility
- [ ] 44px minimum touch targets
- [ ] Proper accessibility labels
- [ ] Screen reader optimization
- [ ] High contrast compliance

### Code Quality
- [ ] PropTypes for all components
- [ ] JSDoc documentation
- [ ] < 150 lines per component
- [ ] Clear, descriptive naming

This implementation guide provides a roadmap for applying the proven refactoring pattern across the entire SayHi application, ensuring consistency, maintainability, and excellent user experience.